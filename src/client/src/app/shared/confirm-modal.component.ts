import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-confirm-modal',
  imports: [ModalComponent],
  template: `
    <app-modal [title]="title" (closed)="cancelled.emit()">
      <div class="confirm-content">
        <p>{{ message }}</p>

        <div class="confirm-actions">
          <button type="button" class="ghost" (click)="cancelled.emit()">Cancel</button>
          <button type="button" class="danger" (click)="confirmed.emit()">{{ confirmLabel }}</button>
        </div>
      </div>
    </app-modal>
  `,
  styles: [
    `
      .confirm-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        border: 1px solid #dce2d6;
        border-radius: 0 0 8px 8px;
        padding: 20px;
        background: #ffffff;
      }

      p {
        margin: 0;
        color: #17211a;
        line-height: 1.45;
      }

      .confirm-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      button {
        min-height: 34px;
        border-radius: 6px;
        padding: 0 12px;
        font: inherit;
        font-size: 0.86rem;
        font-weight: 700;
        cursor: pointer;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          box-shadow 160ms ease,
          color 160ms ease,
          transform 120ms ease;
      }

      button:hover {
        box-shadow: 0 8px 18px rgb(23 33 26 / 0.12);
        transform: translateY(-1px);
      }

      button:active {
        box-shadow: none;
        transform: translateY(0) scale(0.97);
      }

      .ghost {
        border: 1px solid #cad3c4;
        color: #17211a;
        background: #ffffff;
      }

      .ghost:hover {
        border-color: #aebaaa;
        background: #fbfcf8;
      }

      .danger {
        border: 1px solid #f0b4ad;
        color: #ffffff;
        background: #b42318;
      }

      .danger:hover {
        border-color: #e68077;
        background: #961c14;
      }

      @media (prefers-reduced-motion: reduce) {
        button {
          transition: none;
        }
      }
    `,
  ],
})
export class ConfirmModalComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() confirmLabel = 'Confirm';

  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
}
