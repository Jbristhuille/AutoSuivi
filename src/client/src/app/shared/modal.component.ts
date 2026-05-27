import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  template: `
    <section class="modal-backdrop" (click)="close()">
      <div class="modal-panel" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <h2>{{ title }}</h2>
          <button type="button" class="modal-close" aria-label="Close modal" title="Close modal" (click)="close()">
            <app-icon name="x" />
          </button>
        </div>

        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 20;
        display: grid;
        place-items: start center;
        overflow: auto;
        padding: 48px 24px;
        background: rgb(23 33 26 / 0.42);
      }

      .modal-panel {
        width: min(100%, 520px);
      }

      .modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border: 1px solid #dce2d6;
        border-bottom: 0;
        border-radius: 8px 8px 0 0;
        padding: 16px 18px;
        background: #ffffff;
      }

      h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .modal-close {
        display: inline-flex;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        border: 1px solid #cad3c4;
        border-radius: 6px;
        padding: 0;
        color: #17211a;
        background: #ffffff;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          box-shadow 160ms ease,
          transform 120ms ease;
      }

      .modal-close app-icon {
        transition: transform 160ms ease;
      }

      .modal-close:hover {
        border-color: #aebaaa;
        background: #fbfcf8;
        box-shadow: 0 8px 18px rgb(23 33 26 / 0.12);
        transform: translateY(-1px);
      }

      .modal-close:hover app-icon {
        transform: rotate(90deg);
      }

      .modal-close:active {
        box-shadow: none;
        transform: translateY(0) scale(0.97);
      }

      @media (max-width: 640px) {
        .modal-backdrop {
          padding: 24px 16px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .modal-close,
        .modal-close app-icon {
          transition: none;
        }
      }
    `,
  ],
})
export class ModalComponent {
  @Input({ required: true }) title = '';
  @Output() closed = new EventEmitter<void>();

  protected close() {
    this.closed.emit();
  }
}
