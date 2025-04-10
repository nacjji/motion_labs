import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OffsetPagenationDto } from './dto/offset-pagenation.dto';
import { Patients } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: '환자 목록 조회',
    description: `
    환자 목록을 조회합니다. 
    `,
  })
  @ApiOkResponse({
    description: '환자 목록',
    type: [Patients],
  })
  @Get()
  async getPatients(@Query() pagenationDto: OffsetPagenationDto) {
    console.log(pagenationDto);
    // 벤치마크
    const start = Date.now();
    const result = await this.patientsService.getPatients(pagenationDto);

    const end = Date.now();
    console.log(`Time taken: ${end - start}ms`);
    return result;
  }
}
