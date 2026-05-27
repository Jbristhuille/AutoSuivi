import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto';

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
    const data: Prisma.VehicleCreateInput = this.getVehicleData(createVehicleDto);

    return this.prisma.vehicle.create({
      data,
      include: {
        expenses: true,
      },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      return await this.prisma.vehicle.update({
        where: {
          id,
        },
        data: this.getVehicleData(updateVehicleDto),
        include: {
          expenses: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Vehicle not found.');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.vehicle.delete({
        where: {
          id,
        },
      });

      return {
        id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Vehicle not found.');
      }

      throw error;
    }
  }

  private optionalText(value: string | null | undefined) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private optionalNumber(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return null;
    }

    if (!Number.isFinite(value)) {
      throw new BadRequestException('Numeric fields must contain valid numbers.');
    }

    return value;
  }

  private optionalDate(value: string | null | undefined) {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date fields must contain valid dates.');
    }

    return date;
  }

  private getVehicleData(vehicleDto: CreateVehicleDto | UpdateVehicleDto) {
    const brand = vehicleDto.brand?.trim();
    const model = vehicleDto.model?.trim();

    if (!brand || !model) {
      throw new BadRequestException('Brand and model are required.');
    }

    return {
      brand,
      model,
      plateNumber: this.optionalText(vehicleDto.plateNumber),
      year: this.optionalNumber(vehicleDto.year),
      mileage: this.optionalNumber(vehicleDto.mileage),
      purchaseDate: this.optionalDate(vehicleDto.purchaseDate),
      purchasePriceCents: this.optionalNumber(vehicleDto.purchasePriceCents) ?? 0,
      targetSalePriceCents: this.optionalNumber(vehicleDto.targetSalePriceCents),
    };
  }
}
