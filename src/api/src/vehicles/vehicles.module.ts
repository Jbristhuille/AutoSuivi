import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  controllers: [VehiclesController],
  providers: [PrismaService, VehiclesService],
})
export class VehiclesModule {}
