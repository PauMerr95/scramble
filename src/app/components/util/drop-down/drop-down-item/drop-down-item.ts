import { Component, input, output, inject, effect, viewChild, ElementRef } from '@angular/core';
import { InteractivityChecker } from '@angular/cdk/a11y';

@Component({
  selector: 'app-drop-down-item',
  imports: [],
  template: `
  <div class="drop-down-item-wrapper"
  #item
  [class.targeted]="isTargeted()"
  (click)="onClick.emit(optionID())">
    <span [attr.id]="optionID()">{{optionName()}}</span>
  </div>
  `,
  styles: `
    span {
      height: inherit;
      width: inherit;
      display: flex;
      justify-content: center;
      padding: 2px;

      font-size: 11px;
    }
    div {
      display: flex;
      justify-content: center;
      height: 20px;
      width: 100%;
      pointer-events: all;

      color: var(--color-std-100, #f3fdce);
      border-bottom: 1px dashed var(--color-std-200, #e7fb9d);
      background: var(--color-std-800, #4e6204);
    }
    div:hover{
      background-color: var(--color-std-100, #f3fdce);
      color: var(--color-std-800, #4e6204);
    }
    div.targeted {
      background-image: linear-gradient(to top, var(--color-std-600, #9bc408), var(--color-std-800, #4e6204));
    }
  `,
})
export class DropDownItem {
  readonly optionID     = input.required<number>();
  readonly optionName   = input.required<string>();
  readonly isTargeted   = input.required<boolean>();
  readonly visibleRange = input.required<[number, number]>();

  readonly onClick      = output<number>();
  readonly scrollToItem = output<number>();

  readonly itemRef = viewChild<ElementRef<HTMLDivElement>>('item');

  constructor(){
    effect(() => {
      if (this.isTargeted() && this.isOutOfBounds())
        this.scrollToItem.emit(this.optionID());
    });
  }

  isOutOfBounds(): boolean {
    console.log(`Targeted ... ID: ${this.optionID()} | Range: ${this.visibleRange()[0]}|${this.visibleRange()[1]}`);
    return (this.optionID() < this.visibleRange()[0] ||
            this.optionID() >= this.visibleRange()[1]);
  }
}
