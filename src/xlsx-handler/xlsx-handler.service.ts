import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientDto } from 'src/patients/dto/patient.dto';
import { Patients } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class XlsxHandlerService {
  constructor(
    @InjectRepository(Patients)
    private readonly patientsRepository: Repository<Patients>,
  ) {}

  /**
   * Excel 파일 업로드 핸들러
   *
   * 1. 파일을 읽고 파싱하여 rawData로 변환
   * 2. 한 번의 순회에서 직렬화 및 유효성 검사를 수행
   * 3. Map을 사용해 중복 데이터를 병합(아래쪽 값으로 덮어쓰되 빈 값은 덮어쓰지 않음)
   * 4. Bulk Upsert를 수행
   */
  async uploadXlsxFile(file: Express.Multer.File): Promise<{
    totalRows: number;
    processedRows: number;
    skippedRows: number;
  }> {
    // 1. 파일 읽기 및 첫번째 시트 선택
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(
      worksheet,
      {
        defval: '',
      },
    );
    const totalRows = rawData.length;

    // 2. 직렬화 및 유효성 검사 수행
    const validPatients: PatientDto[] = [];
    for (const row of rawData) {
      const patient = new PatientDto({
        id: row['차트번호']
          ? `${row['이름']}_${row['전화번호']}_${row['차트번호']}`
          : `${row['이름']}_${row['전화번호']}`,
        name: row['이름'],
        phone: row['전화번호'],
        chart: row['차트번호'],
        rrn: row['주민등록번호'],
        address: row['주소'],
        memo: row['메모'],
      });
      if (this.validate(patient)) {
        validPatients.push(patient);
      }
    }

    // 3. 중복 제거/병합: Map을 활용하여 동일 식별자(patient.id) 병합
    const mergedPatients = this.mergeDuplicatePatientsOptimized(validPatients);
    const processedRows = mergedPatients.length;

    // 4. Bulk Upsert: 동일 기본키(ID)가 존재하면 삽입을 무시하도록 처리
    await this.patientsRepository
      .createQueryBuilder()
      .insert()
      .into(Patients)
      .values(mergedPatients)
      .orIgnore()
      .execute();

    return {
      totalRows,
      processedRows,
      skippedRows: totalRows - processedRows,
    };
  }

  /**
   * 유효성 검사:
   * - 이름, 차트, 주소, 메모의 길이가 255 이하인지 확인
   * - 전화번호는 하이픈 제거 후 11자리 숫자인지 확인
   * - 주민등록번호는 6자리 또는 7자리 이상(생년월일+성별)으로 올바른지 검사하며,
   *   입력 값을 포맷(생년월일-성별)으로 변경함
   */
  private validate(patient: Patients): boolean {
    if (patient.name.length < 1 || patient.name.length > 255) {
      return false;
    }
    if (patient.chart && patient.chart.length > 255) {
      return false;
    }
    if (patient.address && patient.address.length > 255) {
      return false;
    }
    if (patient.memo && patient.memo.length > 255) {
      return false;
    }

    const cleanPhone =
      typeof patient.phone === 'string'
        ? patient.phone.replace(/-/g, '')
        : patient.phone;
    if (cleanPhone.length !== 11 || Number.isNaN(parseInt(cleanPhone))) {
      return false;
    }

    if (patient.rrn) {
      const cleanRrn = patient.rrn.replace(/-/g, '').replace(/\*/g, '');
      if (cleanRrn.length === 6) {
        const month = parseInt(cleanRrn.substring(2, 4));
        const day = parseInt(cleanRrn.substring(4, 6));
        if (month < 1 || month > 12 || day < 1 || day > 31) {
          return false;
        }
        patient.rrn = `${cleanRrn}-0`;
      } else if (cleanRrn.length >= 7) {
        const month = parseInt(cleanRrn.substring(2, 4));
        const day = parseInt(cleanRrn.substring(4, 6));
        const gender = parseInt(cleanRrn.substring(6, 7));
        if (
          month < 1 ||
          month > 12 ||
          day < 1 ||
          day > 31 ||
          (gender !== 1 && gender !== 2 && gender !== 3 && gender !== 4)
        ) {
          return false;
        }
        patient.rrn = `${cleanRrn.substring(0, 6)}-${gender}`;
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Map을 사용한 중복 제거 및 병합
   * 동일 식별자(patient.id)를 key로 하여 기존 데이터가 있으면 아래쪽 행(patient)의 값으로 덮어쓰기하되, 빈 값은 기존 값을 유지함.
   */
  private mergeDuplicatePatientsOptimized(patients: Patients[]): Patients[] {
    const mergedMap = new Map<string, Patients>();
    const fields: Array<keyof Patients> = [
      'name',
      'phone',
      'chart',
      'rrn',
      'address',
      'memo',
    ];
    for (const patient of patients) {
      const existing = mergedMap.get(patient.id);
      if (existing) {
        fields.forEach((field) => {
          const newValue = patient[field];
          if (newValue !== '' && newValue !== null && newValue !== undefined) {
            existing[field] = newValue;
          }
        });
      } else {
        mergedMap.set(patient.id, { ...patient });
      }
    }
    return Array.from(mergedMap.values());
  }
}
