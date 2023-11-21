import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AUTH_PACKAGE_NAME } from '../../proto/auth.pb';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/app.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE,
          package: AUTH_PACKAGE_NAME,
          protoPath: join('node_modules/questr-proto/proto/auth.proto'),
        },  
      },
    ]),
  ],
  providers: [AuthService, AuthResolver, AppService],
  exports: [AuthService],
})
export class AuthModule {}  