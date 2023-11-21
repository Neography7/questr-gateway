import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUESTION_SERVICE_NAME, QUESTION_PACKAGE_NAME } from '../../proto/question.pb';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { join } from 'path';
import { AppService } from 'src/app.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: QUESTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.QUESTION_SERVICE,
          package: QUESTION_PACKAGE_NAME,
          protoPath: join('node_modules/questr-proto/proto/question.proto'),
        },
      },
    ]),
  ],
  providers: [QuestionService, QuestionResolver, AppService, NotificationGateway],
  exports: [QuestionService],
})
export class QuestionModule {} 