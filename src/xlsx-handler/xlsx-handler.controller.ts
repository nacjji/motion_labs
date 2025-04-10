import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { XlsxHandlerService } from './xlsx-handler.service';

@Controller('xlsx-handler')
export class XlsxHandlerController {
  constructor(private readonly xlsxHandlerService: XlsxHandlerService) {}

  @ApiOperation({
    summary: '1. xlsx 파일 업로드 및 마이그레이션',
    description: `
    xlsx 파일을 업로드해주세요.
    API 응답 시간: 약 1600ms ~ 1900ms


    특이사항
    - 00년 이후 출생자는  주민번호 뒷자리 3,4,5,6만 허용(5,6 외국인)
    - 00년 이전 출생자는 주민번호 뒷자리 1,2,5,6만 허용

    `,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'xlsx 파일 업로드 및 마이그레이션',
    example: {
      totalRows: 50900,
      processedRows: 30167,
      skippedRows: 20733,
    },
  })
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 밴치마크
    const start = Date.now();
    const result = await this.xlsxHandlerService.uploadXlsxFile(file);

    const end = Date.now();
    console.log(`소요시간: ${end - start}ms`);
    return result;
  }
}
