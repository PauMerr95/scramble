import { Component, EventEmitter, Input, Output } from '@angular/core';
import { hideSidePane } from "../icons/hide_sidePane";
import { navbarLocation } from '../navbar/navbar_locations';
import { mode } from '../statusbar/modes';

@Component({
  selector: 'app-side-pane',
  imports: [hideSidePane],
  templateUrl: './side-pane.html',
  styleUrl: './side-pane.scss',
})
export class SidePane {
  @Input() sidePaneElement!: navbarLocation;
  @Output() hideSidePane = new EventEmitter<null>();
  @Output() switchMode = new EventEmitter<mode>();

}
