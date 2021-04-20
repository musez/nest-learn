import { Injectable } from '@nestjs/common';
import { LocalConfigService } from './server/config/local-config.service';

@Injectable()
export class AppService {
  constructor(public readonly localConfigService: LocalConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
