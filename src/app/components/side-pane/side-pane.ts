import { Component, ElementRef, HostListener, EventEmitter, Input, Output, effect, inject, viewChild } from '@angular/core';
import { IconHideSP } from "../icons/hide_sidePane";
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
    console.log(`Keyevent: ${e.key}`);
    switch(e.key){
      case ' ':
        this.lyt.focusOn("CmdLine");
        this.cli.handleInput("Leader");
        break;
      case 'j': case 'ArrowDown':  this.lyt.moveDown();  break;
      case 'k': case 'ArrowUp':    this.lyt.moveUp();    break;
      case 'h': case 'ArrowLeft':  this.lyt.moveLeft();  break;
      case 'l': case 'ArrowRight': this.lyt.moveRight(); break;
    }
    e.preventDefault();
  }
}
