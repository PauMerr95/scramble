import { Component, signal } from '@angular/core';
import { Avatar, SidePaneElement } from '../side_types';
import { AvatarSquirrel } from './avatars/squirrel/squirrel';
import { AvatarBird } from "./avatars/bird/bird";
import { AvatarDuck } from './avatars/duck/duck';
import { AvatarFalling } from './avatars/falling/falling';
import { AvatarEarth } from './avatars/earth/earth';
import { AvatarSheep } from './avatars/sheep/sheep';

@Component({
  selector: 'app-profile',
  imports: [AvatarSheep, AvatarFalling, AvatarEarth, AvatarSquirrel, AvatarBird, AvatarDuck],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  readonly chosenProfilePicture = signal<Avatar>("Bird");
  readonly userName = signal<string>("Test User");
  readonly userDescription = signal<string>("I am a test user and I like long walks on the beach.");
  readonly selectedItem = signal<SidePaneElement>("ProfilePicture");

}
