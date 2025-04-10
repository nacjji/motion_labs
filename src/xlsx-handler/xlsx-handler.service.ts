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
   * 파일 업로드 핸들러
   *
   * 1. 파일 업로드
   * 2. 데이터 직렬화
   * 3. 파싱한 데이터 배열에 담음
   * 4. 유효성 검사한 데이터 배열에 담음
   * 5. 중복제거한 데이터 배열에 담음
   * 6. 배열 DB에 저장 (Bulk upsert 적용)
   */
  async uploadXlsxFile(file: Express.Multer.File) {
    // 파일 읽기, 데이터 직렬화, 유효성 검사, 병합 작업은 동일하게 처리
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(
      worksheet,
      { defval: '' },
    );
    const serializedData = this.serialize(rawData);
    const validatedData = serializedData.filter((patient) =>
      this.validate(patient),
    );
    const mergedData = this.mergeDuplicatePatients(validatedData);
    console.log('병합 결과:', mergedData);

    // Bulk Insert with orIgnore
    const result = await this.patientsRepository
      .createQueryBuilder()
      .insert()
      .into(Patients)
      .values(mergedData)
      .orIgnore() // 중복된 키 발생 시 삽입을 무시함
      .execute();

    console.log('저장 결과:', result);
    return result;
  }

  private serialize(rawData: Record<string, string>[]) {
    return rawData.map((row) => {
      const identifier = row['차트번호']
        ? `${row['이름']}_${row['전화번호']}_${row['차트번호']}`
        : `${row['이름']}_${row['전화번호']}`;

      return new PatientDto({
        id: identifier,
        name: row['이름'],
        phone: row['전화번호'],
        chart: row['차트번호'],
        rrn: row['주민등록번호'],
        address: row['주소'],
        memo: row['메모'],
      });
    });
  }

  private validate(patient: Patients) {
    if (patient.name.length < 1 || patient.name.length > 255) {
      return false;
    }
    if (patient.chart.length > 255) {
      return false;
    }
    if (patient.address.length > 255) {
      return false;
    }
    if (patient.memo.length > 255) {
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

  mergeDuplicatePatients(patients: Patients[]): Patients[] {
    const mergedResults: Patients[] = [];
    let currentMerged: Patients | null = null;
    let currentId: string | null = null;

    for (const patient of patients) {
      if (currentId !== patient.id) {
        if (currentMerged) {
          mergedResults.push(currentMerged);
        }
        currentId = patient.id;
        currentMerged = { ...patient };
      } else {
        const fields: Array<keyof Patients> = [
          'name',
          'phone',
          'chart',
          'rrn',
          'address',
          'memo',
        ];
        for (const field of fields) {
          const newValue = patient[field];
          if (newValue !== '' && newValue !== null && newValue !== undefined) {
            currentMerged![field] = newValue;
          }
        }
      }
    }
    if (currentMerged) {
      mergedResults.push(currentMerged);
    }
    console.log('병합된 최종 결과:', mergedResults);
    return mergedResults;
  }
}
