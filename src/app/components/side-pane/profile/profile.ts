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

@Component({
  selector: 'app-profile',
  imports: [AvatarSheep, AvatarFalling, AvatarEarth, AvatarSquirrel, AvatarBird, AvatarDuck],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  readonly userName = signal<string>("Test User");
  readonly userDescription = signal<string>("I am a test user and I like long walks on the beach.");

  readonly lyt = inject(LayoutService);
  readonly data = inject(DataSessionService);

  
  constructor() {
    effect(() => {
      if (this.lyt.sidePaneState() === "Profile") {
        this.lyt.loadGrid(profileGrid);
      }
    });
  }

}
