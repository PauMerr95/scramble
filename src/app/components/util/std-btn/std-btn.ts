import { Component, computed, inject, input, output } from '@angular/core';
import { ButtonID } from '../../../types/util_types';
import { LayoutService } from '../../../services/layout-service';

@Component({
  selector: 'app-std-btn',
  imports: [],
  template: `
    <div class="btn-wrapper">
      <button class="btn"
      [class.targeted]="isTargeted()"
      [class.pseudoactive]="isTriggered()";
      (click)="this.onTrigger.emit()">{{innerText()}}</button>
    </div>
  `,
  styles: `
  :host {
    pointer-events: none;
  }

  .btn {
    background-color: var(--color-std-900, #273102);
    border: 2px solid var(--color-std-400, #cef72b);
    border-radius: 10px;
    color: var(--color-std-100, #f3fdce);
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    padding: 0 18px;
    line-height: 25px;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .btn:hover {
    color: var(--color-std-900, #273102);
    background-color: var(--color-std-100, #f3fdce);
  }

  .btn:active {
    transform: translate(2px, 2px);
  }
  .btn.pseudoactive {
    transform: translate(2px, 2px);
  }

  .btn.targeted {
    box-shadow: 0  3px 10px 0 var(--color-std-600, #9bc408),
                0 -3px 10px 0 var(--color-std-600, #9bc408);
  }

  @media (min-width: 768px) {
    .btn {
      min-width: 120px;
      padding: 0 25px;
    }
  }
  `,
})
export class StdBtn {
  readonly lyt = inject(LayoutService);

  readonly id          = input.required<ButtonID>();
  readonly innerText   = input<string>("Click!");
  readonly isTargeted  = input<boolean>(false);
  readonly isTriggered = computed<boolean>(() => {
    return this.lyt.activeBtn() === this.id();
  })
  readonly onTrigger   = output<void>();

}
