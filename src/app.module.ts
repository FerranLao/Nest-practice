import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [TaskModule, MongooseModule.forRoot('mongodb://localhost/nest'), AuthModule],
})
export class AppModule {}
