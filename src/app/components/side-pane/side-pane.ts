import { Component, EventEmitter, Input, Output } from '@angular/core';
import { hideSidePane } from "../icons/hide_sidePane";
import { NavbarLocation } from '../../types/navbar_locations';
import { EditorMode } from '../../types/main_types';

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
}
