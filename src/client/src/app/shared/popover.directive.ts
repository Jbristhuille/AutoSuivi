import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'button[data-popover], button[appPopover]',
  standalone: true,
})
export class PopoverDirective implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private popover: HTMLElement | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;

  @HostListener('mouseenter')
  @HostListener('focus')
  protected show() {
    const button = this.elementRef.nativeElement;

    if (button.disabled || this.popover) {
      return;
    }

    const text = button.getAttribute('data-popover')?.trim();

    if (!text) {
      return;
    }

    this.popover = this.renderer.createElement('div');
    this.renderer.addClass(this.popover, 'app-popover');
    this.renderer.setAttribute(this.popover, 'role', 'tooltip');
    this.renderer.setProperty(this.popover, 'textContent', text);
    this.renderer.appendChild(this.document.body, this.popover);

    const win = this.document.defaultView;
    this.removeResizeListener = win ? this.renderer.listen(win, 'resize', () => this.positionPopover()) : null;
    this.removeScrollListener = win ? this.renderer.listen(win, 'scroll', () => this.positionPopover()) : null;

    this.positionPopover();
    this.renderer.addClass(this.popover, 'visible');
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('click')
  protected hide() {
    if (!this.popover) {
      return;
    }

    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;
    this.renderer.removeChild(this.document.body, this.popover);
    this.popover = null;
  }

  ngOnDestroy() {
    this.hide();
  }

  private positionPopover() {
    if (!this.popover) {
      return;
    }

    const buttonRect = this.elementRef.nativeElement.getBoundingClientRect();
    const popoverRect = this.popover.getBoundingClientRect();
    const gap = 10;
    const viewportPadding = 12;
    const viewportWidth = this.document.documentElement.clientWidth;
    const viewportHeight = this.document.documentElement.clientHeight;

    const centeredLeft = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2;
    const maxLeft = viewportWidth - popoverRect.width - viewportPadding;
    const safeMaxLeft = Math.max(viewportPadding, maxLeft);
    const left = Math.min(Math.max(centeredLeft, viewportPadding), safeMaxLeft);
    const topAbove = buttonRect.top - popoverRect.height - gap;
    const topBelow = buttonRect.bottom + gap;
    const maxTop = viewportHeight - popoverRect.height - viewportPadding;
    const top = topAbove >= viewportPadding ? topAbove : Math.min(topBelow, Math.max(viewportPadding, maxTop));

    this.renderer.setStyle(this.popover, 'left', `${left}px`);
    this.renderer.setStyle(this.popover, 'top', `${top}px`);
  }
}
