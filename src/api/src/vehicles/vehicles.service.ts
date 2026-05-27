import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vehicle.findMany({
      include: this.vehicleInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  create(createVehicleDto: CreateVehicleDto) {
    const data: Prisma.VehicleCreateInput = this.getVehicleData(createVehicleDto);

    return this.prisma.vehicle.create({
      data,
      include: this.vehicleInclude,
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      return await this.prisma.vehicle.update({
        where: {
          id,
        },
        data: this.getVehicleData(updateVehicleDto),
        include: this.vehicleInclude,
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

  async addExpense(id: string, createExpenseDto: CreateExpenseDto) {
    await this.ensureVehicleExists(id);

    const label = createExpenseDto.label?.trim();

    if (!label) {
      throw new BadRequestException('Expense label is required.');
    }

    const amountCents = this.requiredPositiveNumber(createExpenseDto.amountCents, 'Expense amount');
    const spentAt = this.requiredDate(createExpenseDto.spentAt, 'Expense date');

    await this.prisma.expense.create({
      data: {
        vehicleId: id,
        label,
        amountCents,
        spentAt,
      },
    });

    return this.findById(id);
  }

  async removeExpense(id: string, expenseId: string) {
    await this.ensureVehicleExists(id);

    const result = await this.prisma.expense.deleteMany({
      where: {
        id: expenseId,
        vehicleId: id,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Expense not found.');
    }

    return this.findById(id);
  }

  private readonly vehicleInclude = {
    expenses: {
      orderBy: {
        spentAt: 'desc' as const,
      },
    },
  };

  private async findById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id,
      },
      include: this.vehicleInclude,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    return vehicle;
  }

  private async ensureVehicleExists(id: string) {
    await this.findById(id);
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

  private requiredDate(value: string | null | undefined, fieldName: string) {
    const date = this.optionalDate(value);

    if (!date) {
      throw new BadRequestException(`${fieldName} is required.`);
    }

    return date;
  }

  private requiredPositiveNumber(value: number | null | undefined, fieldName: string) {
    const number = this.optionalNumber(value);

    if (number === null || number <= 0) {
      throw new BadRequestException(`${fieldName} must be greater than zero.`);
    }

    return number;
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
