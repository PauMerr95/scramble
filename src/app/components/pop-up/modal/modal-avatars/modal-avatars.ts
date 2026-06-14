import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../services/layout-service';
import { avatars, Avatar } from '../../../../types/side_types';
import { AvatarBird } from '../../../side-pane/profile/avatars/bird/bird';
import { AvatarDuck } from '../../../side-pane/profile/avatars/duck/duck';
import { AvatarEarth } from '../../../side-pane/profile/avatars/earth/earth';
import { AvatarFalling } from '../../../side-pane/profile/avatars/falling/falling';
import { AvatarSheep } from '../../../side-pane/profile/avatars/sheep/sheep';
import { AvatarSquirrel } from '../../../side-pane/profile/avatars/squirrel/squirrel';

@Component({
  selector: 'app-modal-avatars',
  imports: [ AvatarBird, AvatarDuck, AvatarEarth, AvatarFalling, AvatarSheep, AvatarSquirrel],
  templateUrl: './modal-avatars.html',
  styleUrl: './modal-avatars.scss',
})
export class ModalAvatars {
  readonly lyt = inject(LayoutService);
  readonly avatars = avatars;

  select(avatar: Avatar) {
    this.lyt.activeAvatar.set(avatar);
    this.lyt.closeModal(); 
  }
}
