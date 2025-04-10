import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class OffsetPagenationDto {
  @ApiProperty({
    description: '페이지 번호, ex) 1',
    required: false,
    default: 1,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({
    description: '한 페이지에 보여줄 데이터 개수, ex) 10',
    required: false,
    default: 10,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
