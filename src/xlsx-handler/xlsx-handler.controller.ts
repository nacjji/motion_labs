import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { XlsxHandlerService } from './xlsx-handler.service';

@Controller('xlsx-handler')
export class XlsxHandlerController {
  constructor(private readonly xlsxHandlerService: XlsxHandlerService) {}

  @ApiOperation({
    summary: 'xlsx 파일 업로드',
    description: 'xlsx 파일을 업로드해주세요.',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.xlsxHandlerService.uploadXlsxFile(file);
  }
}
