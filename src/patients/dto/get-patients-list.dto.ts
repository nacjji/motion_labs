import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OffsetPagenationDto } from '../../common/dto/offset-pagenation.dto';

export class GetPatientsListDto extends OffsetPagenationDto {
  @ApiPropertyOptional({
    description: '이름, ex) 홍길동',
    example: '황혜진',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: '전화번호, ex) 01049941629',
    example: '01049941629',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: '차트번호, ex) 605657',
    example: '605657',
    required: false,
  })
  @IsOptional()
  @IsString()
  chart: string;
}
