import { ApiProperty } from '@nestjs/swagger';

class PatientDto {
  @ApiProperty({
    description: '환자 ID',
    example: '홍길동_01011111111_123456',
  })
  id: string;

  @ApiProperty({
    description: '환자 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '전화번호',
    example: '01011111111',
  })
  phone: string;

  @ApiProperty({
    description: '차트번호',
    example: '123456',
  })
  chart: string;

  @ApiProperty({
    description: '주민등록번호',
    example: '010101-3',
  })
  rrn: string;

  @ApiProperty({
    description: '주소',
    example: '서울특별시 중구 중앙동 1-1',
  })
  address: string;

  @ApiProperty({
    description: '메모',
    example: '보호자 번호 수정 필요',
  })
  memo: string;
}

export class GetPatientListResponseDto {
  @ApiProperty({
    description: '전체 환자 수',
    example: 30167,
  })
  total: number;

  @ApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '페이지당 환자 수',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: '환자 목록',
    type: [PatientDto],
  })
  data: PatientDto[];
}
