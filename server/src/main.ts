import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const res = errors.map((err) => ({
          [err.property]: Object.values(err.constraints)[0],
        }));

        return new BadRequestException(res);
      },
    }),
  );
  await app.listen(4000);
}
bootstrap();
