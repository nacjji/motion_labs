import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class OffsetPagenationDto {
  @ApiProperty({
    description: '페이지 번호',
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({
    description: '한 페이지에 보여줄 데이터 개수',
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
