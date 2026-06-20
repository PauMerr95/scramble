import { Component, effect, signal, inject } from '@angular/core';
import { Avatar, MoveGrid } from '../../../types/side_types';
import { AvatarSquirrel } from './avatars/squirrel/squirrel';
import { AvatarBird } from "./avatars/bird/bird";
import { AvatarDuck } from './avatars/duck/duck';
import { AvatarFalling } from './avatars/falling/falling';
import { AvatarEarth } from './avatars/earth/earth';
import { AvatarSheep } from './avatars/sheep/sheep';
import { LayoutService } from '../../../services/layout-service';
import { DataSessionService } from '../../../services/data-session-service';
import { profileGrid } from '../../../move-grids/mv-grids-sidePane';
import { DropDown } from "../../util/drop-down/drop-down";
import { UserDataService } from '../../../services/user-data';


@Component({
  selector: 'app-profile',
  imports: [AvatarSheep, AvatarFalling, AvatarEarth, AvatarSquirrel, AvatarBird, AvatarDuck, DropDown, DropDown],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  readonly userName = signal<string>("Test User");
  readonly userDescription = signal<string>("I am a test user and I like long walks on the beach.");

  readonly lyt = inject(LayoutService);
  readonly data = inject(DataSessionService);
  readonly user = inject(UserDataService);
  
  readonly availableThemes = ["DarkLime", "Ocean"];

  
  constructor() {
    effect(() => {
      if (this.lyt.currentFocus() === "SidePane" 
          && this.lyt.sidePaneState() === "Profile") {
        this.lyt.loadGrid(profileGrid);
      }
    });
  }

}
