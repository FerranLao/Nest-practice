import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || serverConfig.port;
  await app.listen(serverConfig.port);
  logger.log(`Server ready and listening on port: ${port}`);
}
bootstrap();
