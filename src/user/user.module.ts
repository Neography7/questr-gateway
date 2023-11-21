import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '../../proto/user.pb';
import { UserService } from './user.service';
import { join } from 'path';
import { UserResolver } from './user.resolver';
import { AppService } from 'src/app.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_SERVICE,
          package: USER_PACKAGE_NAME,
          protoPath: join('node_modules/questr-proto/proto/user.proto')
        },
      },
    ]),
  ],
  providers: [UserService, UserResolver, AppService],
  exports: [UserService],
}) 
export class UserModule {}