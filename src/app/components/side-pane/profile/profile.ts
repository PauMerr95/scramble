import { Component, signal } from '@angular/core';
import { Avatar } from '../side_types';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  readonly chosenProfilePicture = signal<Avatar>("Squirrel");
  readonly userName = signal<string>("Test User");

}
