import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('모션랩스 API 문서')
    .setDescription(
      `
      안녕하세요. 모션랩스 지원자 나지원입니다.

      1. POST /xlsx-handler/upload API에서 patient_data.xlsx 파일을 업로드 해주세요.
      
      2. 업로드가 완료되면, GET /patients 에서 환자 목록을 조회할 수 있습니다.


      `,
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  // 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  const port = 3000;
  await app.listen(port, () =>
    console.log(`Swagger : http://localhost:${port}/docs`),
  );
}

bootstrap();
