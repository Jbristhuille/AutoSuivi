import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent, IconName } from './icon.component';
import { PopoverDirective } from './popover.directive';

export type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
  leaving?: boolean;
};

@Component({
  selector: 'app-toast-list',
  imports: [CommonModule, IconComponent, PopoverDirective],
  template: `
    <section class="toast-list" aria-live="polite" aria-label="Notifications">
      <article class="toast" *ngFor="let toast of toasts" [ngClass]="[toast.variant, toast.leaving ? 'leaving' : '']">
        <app-icon [name]="getIconName(toast.variant)" />
        <p>{{ toast.message }}</p>
        <button
          type="button"
          aria-label="Dismiss notification"
          title="Dismiss notification"
          data-popover="Dismiss this notification"
          [disabled]="toast.leaving"
          (click)="dismissed.emit(toast.id)"
        >
          <app-icon name="x" />
        </button>
      </article>
    </section>
  `,
  styles: [
    `
      .toast-list {
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 30;
        display: flex;
        width: min(360px, calc(100vw - 36px));
        flex-direction: column;
        gap: 10px;
      }

      .toast {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
        border: 1px solid #dce2d6;
        border-left-width: 4px;
        border-radius: 8px;
        padding: 12px;
        background: #ffffff;
        box-shadow: 0 14px 35px rgb(23 33 26 / 0.14);
        animation: toast-in 220ms ease-out both;
      }

      .leaving {
        animation: toast-out 180ms ease-in both;
      }

      .success {
        border-left-color: #1f6f51;
        color: #14533b;
      }

      .error {
        border-left-color: #b42318;
        color: #b42318;
      }

      .info {
        border-left-color: #2f6fed;
        color: #1f4fb8;
      }

      p {
        min-width: 0;
        margin: 0;
        color: #17211a;
        font-size: 0.92rem;
        font-weight: 700;
        line-height: 1.35;
        overflow-wrap: anywhere;
      }

      button {
        display: inline-flex;
        width: 28px;
        height: 28px;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 6px;
        padding: 0;
        color: #657267;
        background: transparent;
        cursor: pointer;
        transition:
          background-color 160ms ease,
          color 160ms ease,
          transform 120ms ease;
      }

      button app-icon {
        transition: transform 160ms ease;
      }

      button:hover {
        color: #17211a;
        background: #f4f6f1;
        transform: translateY(-1px);
      }

      button:hover app-icon {
        transform: rotate(90deg);
      }

      button:active {
        transform: translateY(0) scale(0.95);
      }

      button:disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateX(18px) scale(0.98);
        }

        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes toast-out {
        from {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        to {
          opacity: 0;
          transform: translateX(18px) scale(0.98);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        button,
        button app-icon {
          transition: none;
        }

        .toast,
        .leaving {
          animation: none;
        }
      }
    `,
  ],
})
export class ToastListComponent {
  @Input({ required: true }) toasts: Toast[] = [];
  @Output() dismissed = new EventEmitter<number>();

  protected getIconName(variant: ToastVariant): IconName {
    if (variant === 'success') {
      return 'check-circle';
    }

    if (variant === 'error') {
      return 'alert-circle';
    }

    return 'info-circle';
  }
}
