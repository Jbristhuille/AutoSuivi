import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'AutoSuivi API',
      status: 'ok',
    };
  }
}
