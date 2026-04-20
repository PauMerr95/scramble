import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconFolder } from "../icons/folder";
import { IconSearchDB } from "../icons/db_search";
import { IconProfile } from "../icons/profile";
import { navbarLocation } from './navbar_locations';

@Component({
  selector: 'app-navbar',
  imports: [IconFolder, IconSearchDB, IconProfile],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Output() toggleSidePane = new EventEmitter<navbarLocation>();
  @Input() activeIcon: navbarLocation | "hidden" = "hidden";

}
