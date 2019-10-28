import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as config from 'config';

const dbConfig = config.get('db');
@Module({
  imports: [TaskModule, MongooseModule.forRoot(process.env.DB_URL || dbConfig.URL), AuthModule],
})
export class AppModule { }
