import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLError } from 'graphql';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nService } from './i18n/i18n.service';
import { I18nModule } from './i18n/i18n.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './auth/guards/rate.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      introspection: false, 
      context: ({ req, res }: any) => ({ req, res })
    }), 
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    AuthModule,
    UserModule,
    QuestionModule,  
    NotificationModule, 
    I18nModule
  ],
  providers: [AppService, { provide: APP_GUARD, useClass: GqlThrottlerGuard, }, ],
})
export class AppModule {}
