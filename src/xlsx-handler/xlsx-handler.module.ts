import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/patients/entities/patient.entity';
import { XlsxHandlerController } from './xlsx-handler.controller';
import { XlsxHandlerService } from './xlsx-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients])],
  controllers: [XlsxHandlerController],
  providers: [XlsxHandlerService],
})
export class XlsxHandlerModule {}
