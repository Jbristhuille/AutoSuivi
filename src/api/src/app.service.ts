import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'AutoTrack API',
      status: 'ok',
    };
  }
}
