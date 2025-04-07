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
   */
  async uploadXlsxFile(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(
      worksheet,
      { defval: '' },
    );

    const result = await this.processPatientData(rawData);

    return result;
  }

  // 데이터 전처리
  private async processPatientData(rows: Record<string, string>[]) {
    const totalRows = rows.length;
    let processedRows = 0;
    let skippedRows = 0;

    const create: PatientDto[] = [];
    for (const row of rows) {
      const isValid = this.validateRow(row);
      if (!isValid) {
        skippedRows++;
        continue;
      }

      const patient = new PatientDto({
        name: row['이름'],
        phone: row['전화번호'],
        chartNumber: row['차트번호'],
        birthGender: row['생년월일-1 ~ 4'],
        address: row['주소'],
        memo: row['메모'],
      });
      console.log(row);

      create.push(patient);

      // TODO: 중복 병합 처리 및 DB 저장
      processedRows++;
    }
    await this.patientsRepository.save(create);

    return {
      totalRows,
      processedRows,
      skippedRows,
    };
  }

  // 유효성 검사
  private validateRow(row: Record<string, string>): boolean {
    // TODO: 이름/전화번호/주민번호 등 유효성 검사
    return true;
  }
}
