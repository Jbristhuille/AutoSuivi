import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type IconName = 'pencil' | 'trash';

const ICON_PATHS: Record<IconName, string[]> = {
  pencil: [
    'M12 20h9',
    'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  ],
  trash: [
    'M3 6h18',
    'M8 6V4h8v2',
    'M19 6l-1 14H6L5 6',
    'M10 11v6',
    'M14 11v6',
  ],
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
