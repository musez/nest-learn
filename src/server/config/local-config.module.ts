import { Module, Global } from '@nestjs/common';
import { LocalConfigService } from './local-config.service';

@Global()
@Module({
  providers: [
    {
      provide: LocalConfigService,
      useValue: new LocalConfigService(`.env.${process.env.NODE_ENV || 'development'}`),
    },
  ],
  exports: [LocalConfigService],
})
export class LocalConfigModule {
}
