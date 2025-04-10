import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetPatientListResponseDto } from './dto/get-patients-list-response.dto';
import { GetPatientsListDto } from './dto/get-patients-list.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: '2. 환자 목록 조회',
    description: `
    환자 목록을 조회합니다.
    페이지네이션 방식은 offset 방식을 사용합니다.
    API 응답 시간: 약 10ms ~ 50ms
    `,
  })
  @ApiOkResponse({
    description: '환자 목록 조회하기',
    type: [GetPatientListResponseDto],
    example: {
      total: 30167,
      page: 1,
      count: 10,
      data: [
        {
          id: '홍길동_01011111111_123456',
          name: '홍길동',
          phone: '01011111111',
          chart: '123456',
          rrn: '010101-3',
          address: '서울특별시 중구 중앙동 1-1',
          memo: '보호자 번호 수정 필요',
        },
      ],
    },
  })
  @Get()
  async getPatientsList(@Query() pagenationDto: GetPatientsListDto) {
    // 벤치마크
    const start = Date.now();
    const result = await this.patientsService.getPatients(pagenationDto);

    const end = Date.now();
    console.log(`소요시간: ${end - start}ms`);
    return result;
  }
}
