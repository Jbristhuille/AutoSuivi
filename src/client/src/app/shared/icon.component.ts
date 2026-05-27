import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type IconName =
  | 'alert-circle'
  | 'check-circle'
  | 'info-circle'
  | 'pencil'
  | 'refresh'
  | 'trash'
  | 'x';

const ICON_PATHS: Record<IconName, string[]> = {
  'alert-circle': [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M12 8v4',
    'M12 16h.01',
  ],
  'check-circle': [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M8 12l3 3 5-6',
  ],
  'info-circle': [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M12 16v-4',
    'M12 8h.01',
  ],
  pencil: [
    'M12 20h9',
    'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  ],
  refresh: [
    'M21 12a9 9 0 0 1-15.6 6.1L3 16',
    'M3 21v-5h5',
    'M3 12a9 9 0 0 1 15.6-6.1L21 8',
    'M21 3v5h-5',
  ],
  trash: [
    'M3 6h18',
    'M8 6V4h8v2',
    'M19 6l-1 14H6L5 6',
    'M10 11v6',
    'M14 11v6',
  ],
  x: ['M18 6 6 18', 'M6 6l12 12'],
};

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path *ngFor="let path of paths" [attr.d]="path" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 18px;
        height: 18px;
      }

      svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }
    `,
  ],
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;

  protected get paths() {
    return ICON_PATHS[this.name];
  }
}
