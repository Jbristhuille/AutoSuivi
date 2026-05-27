import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vehicle.findMany({
      include: {
        expenses: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  create(createVehicleDto: CreateVehicleDto) {
    const brand = createVehicleDto.brand?.trim();
    const model = createVehicleDto.model?.trim();

    if (!brand || !model) {
      throw new BadRequestException('Brand and model are required.');
    }

    const data: Prisma.VehicleCreateInput = {
      brand,
      model,
      plateNumber: this.optionalText(createVehicleDto.plateNumber),
      year: this.optionalNumber(createVehicleDto.year),
      mileage: this.optionalNumber(createVehicleDto.mileage),
      purchaseDate: this.optionalDate(createVehicleDto.purchaseDate),
      purchasePriceCents: this.optionalNumber(createVehicleDto.purchasePriceCents) ?? 0,
      targetSalePriceCents: this.optionalNumber(createVehicleDto.targetSalePriceCents),
    };

    return this.prisma.vehicle.create({
      data,
      include: {
        expenses: true,
      },
    });
  }

  private optionalText(value: string | null | undefined) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  private optionalNumber(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (!Number.isFinite(value)) {
      throw new BadRequestException('Numeric fields must contain valid numbers.');
    }

    return value;
  }

  private optionalDate(value: string | null | undefined) {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date fields must contain valid dates.');
    }

    return date;
  }
}
