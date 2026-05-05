import { Component, ElementRef, HostListener, EventEmitter, Input, Output, effect, inject, viewChild } from '@angular/core';
import { IconHideSP } from "../icons/hide_sidePane";
import { NavbarLocation } from '../../types/navbar_locations';
import { EditorMode } from '../../types/main_types';
import { LayoutService } from '../../services/layout-service';
import { ProfileComponent } from './profile/profile';
import { CmdLineService } from '../../services/cmd-line-service';
import { Query } from './query/query/query';

@Component({
  selector: 'app-side-pane',
  imports: [IconHideSP, ProfileComponent, Query],
  templateUrl: './side-pane.html',
  styleUrl: './side-pane.scss',
})
export class SidePane {
  @Input() sidePaneElement!: NavbarLocation;
  @Output() hideSidePane = new EventEmitter<null>();
  @Output() switchMode = new EventEmitter<EditorMode>();

  hover: boolean = false;

  readonly lyt = inject(LayoutService);
  readonly cli = inject(CmdLineService);

  private readonly _sidePaneRef = viewChild.required<ElementRef<HTMLDivElement>>('sidePane');

  constructor(){
    effect(() => {
      if (this.lyt.currentFocus() === "SidePane") {
        this._sidePaneRef().nativeElement.focus();
      }                       
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent){
    if (e.key === ' ') {
      this.lyt.focusOn("CmdLine");
      this.cli.handleInput("Leader");
    }
    e.preventDefault();
  }
}
