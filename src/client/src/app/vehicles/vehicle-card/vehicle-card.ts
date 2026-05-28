import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/icon.component';
import { LocalDatePipe } from '../../shared/local-date.pipe';
import { MoneyPipe } from '../../shared/money.pipe';
import { PopoverDirective } from '../../shared/popover.directive';
import {
  getVehicleExpensesTotalCents,
  getVehicleInvestmentCents,
  getVehicleMarginCents,
} from '../vehicle-calculations';
import { CreateExpensePayload, ExpenseForm, Vehicle } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, FormsModule, IconComponent, LocalDatePipe, MoneyPipe, PopoverDirective],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.scss',
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: Vehicle;
  @Input() deleting = false;
  @Input() addingExpense = false;
  @Input() deletingExpenseId: string | null = null;

  @Output() deleteRequested = new EventEmitter<string>();
  @Output() editRequested = new EventEmitter<Vehicle>();
  @Output() expenseSubmitted = new EventEmitter<{
    payload: CreateExpensePayload;
    vehicleId: string;
  }>();
  @Output() expenseDeleteRequested = new EventEmitter<{
    expenseId: string;
    vehicleId: string;
  }>();

  protected readonly expenseForm: ExpenseForm = {
    label: '',
    amount: null,
    spentAt: this.getTodayInputDate(),
  };
  protected vehicleExpanded = false;
  protected expensesExpanded = false;
  protected expenseFormSubmitted = false;

  protected investmentCents() {
    return getVehicleInvestmentCents(this.vehicle);
  }

  protected expensesTotalCents() {
    return getVehicleExpensesTotalCents(this.vehicle);
  }

  protected marginCents() {
    return getVehicleMarginCents(this.vehicle);
  }

  protected requestDelete() {
    this.deleteRequested.emit(this.vehicle.id);
  }

  protected requestEdit() {
    this.editRequested.emit(this.vehicle);
  }

  protected toggleVehicle() {
    this.vehicleExpanded = !this.vehicleExpanded;
  }

  protected toggleExpenses() {
    this.expensesExpanded = !this.expensesExpanded;
    this.clearExpenseErrors();
  }

  protected submitExpense() {
    this.expenseFormSubmitted = true;

    if (!this.isExpenseFormValid()) {
      return;
    }

    this.expenseSubmitted.emit({
      vehicleId: this.vehicle.id,
      payload: {
        label: this.expenseForm.label.trim(),
        amountCents: Math.round(Number(this.expenseForm.amount) * 100),
        spentAt: this.expenseForm.spentAt,
      },
    });
    this.resetExpenseForm();
  }

  protected resetExpenseForm() {
    this.expenseForm.label = '';
    this.expenseForm.amount = null;
    this.expenseForm.spentAt = this.getTodayInputDate();
    this.expenseFormSubmitted = false;
  }

  protected clearExpenseErrors() {
    this.expenseFormSubmitted = false;
  }

  protected requestExpenseDelete(expenseId: string) {
    this.expenseDeleteRequested.emit({
      expenseId,
      vehicleId: this.vehicle.id,
    });
  }

  private getTodayInputDate() {
    return new Date().toISOString().slice(0, 10);
  }

  protected hasExpenseError(field: keyof ExpenseForm) {
    if (!this.expenseFormSubmitted) {
      return false;
    }

    if (field === 'label') {
      return !this.expenseForm.label.trim();
    }

    if (field === 'amount') {
      return !this.expenseForm.amount || Number(this.expenseForm.amount) <= 0;
    }

    if (field === 'spentAt') {
      return !this.expenseForm.spentAt;
    }

    return false;
  }

  protected getExpenseError(field: keyof ExpenseForm) {
    if (field === 'amount') {
      return 'Price must be greater than zero.';
    }

    if (field === 'spentAt') {
      return 'Date is required.';
    }

    return 'Label is required.';
  }

  private isExpenseFormValid() {
    return (
      !this.hasExpenseError('label') &&
      !this.hasExpenseError('amount') &&
      !this.hasExpenseError('spentAt')
    );
  }
}
