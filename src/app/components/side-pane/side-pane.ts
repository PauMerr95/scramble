import { Component, ElementRef, EventEmitter, Input, Output, effect, inject, viewChild } from '@angular/core';
import { hideSidePane } from "../icons/hide_sidePane";
import { NavbarLocation } from '../../types/navbar_locations';
import { EditorMode } from '../../types/main_types';
import { LayoutService } from '../../services/layout-service';

@Component({
  selector: 'app-side-pane',
  imports: [hideSidePane],
  templateUrl: './side-pane.html',
  styleUrl: './side-pane.scss',
})
export class SidePane {
  @Input() sidePaneElement!: NavbarLocation;
  @Output() hideSidePane = new EventEmitter<null>();
  @Output() switchMode = new EventEmitter<EditorMode>();

  hover: Boolean = false;

  readonly lyt = inject(LayoutService);

  private readonly _sidePaneRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('placeholderElement');

  constructor(){
    effect(() => {
      if (this.lyt.currentFocus() === "SidePane") {
        this._sidePaneRef().nativeElement.focus();
      }                       
    });
  }
}
