import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, 
    { 
      logger: new Logger(),
    }
  );

  await app.listen(3005);
  console.log(`[App] App started in 'http://localhost:3005'`);

  const appService: AppService = app.get(AppService);
  await appService.test();
}
bootstrap();