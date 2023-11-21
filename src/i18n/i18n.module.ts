import { Module, MiddlewareConsumer } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nService).forRoutes('*');
  }
}