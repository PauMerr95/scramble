import { Component, input, model, ElementRef, viewChild, output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  imports: [],
  template: `
    <select #select [attr.aria-title]="title()" required (change)=onChange()>
      @for (opt of optionList(); track $index) {
        <option [value]="opt" [selected]="opt === activeOption()">{{ opt }}</option>
      }
    </select>
  `,
  styles: `
  :host{
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(80%, 600px);
    height: 50px;
  }
  select{
    padding: 5px 10px 5px 10px;
    display: block;
    border: 2px solid var(--color-std-500, #c2f50a);
    color: var(--color-std-100, #f3fdce);
    background: var(--color-std-800, #4e6204);
    border-radius: 2px;
    box-shadow: 8px 8px 5px 0px var(--color-std-900, #273102);
  }
  `,
})
export class DropDown {
  private _selectRef = viewChild.required<ElementRef>('select');
  readonly optionList   = input<string[]>([]); 
  readonly title        = input("Generic Dropdown");
  readonly activeOption = model<string>("Select Option");
  changedOption = output<void>();

  onChange(){
    const option = this._selectRef().nativeElement.value;
    this.activeOption.set(option);
    this.changedOption.emit();
  }
}
