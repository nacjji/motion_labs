import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPatientsListDto } from './dto/get-patients-list.dto';
import { Patients } from './entities/patient.entity';
@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private readonly patientsRepository: Repository<Patients>,
  ) {}

  async getPatients(pagenationDto: GetPatientsListDto) {
    const { page, limit = 10 } = pagenationDto;
    const pageSize = Number(limit);

    const queryBuilder = this.patientsRepository
      .createQueryBuilder('patient')
      .select([
        'patient.id id',
        'patient.name name',
        'patient.phone phone',
        'patient.chart chart',
        'patient.rrn rrn',
        'patient.address address',
        'patient.memo memo',
      ]);
    queryBuilder.orderBy('patient.id', 'ASC');

    if (pagenationDto.name) {
      queryBuilder.andWhere('patient.name LIKE :name', {
        name: `%${pagenationDto.name}%`,
      });
    }
    if (pagenationDto.phone) {
      queryBuilder.andWhere('patient.phone LIKE :phone', {
        phone: `%${pagenationDto.phone}%`,
      });
    }
    if (pagenationDto.chart) {
      queryBuilder.andWhere('patient.chart LIKE :chart', {
        chart: `%${pagenationDto.chart}%`,
      });
    }
    // 전체 데이터 수 조회
    const total = await queryBuilder.getCount();

    const dataToReturn = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawMany();

    return {
      total,
      page,
      count: pageSize,
      data: dataToReturn,
    };
  }
}
