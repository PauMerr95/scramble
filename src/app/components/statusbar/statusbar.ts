import { Input, Component } from '@angular/core';
import { mode } from './modes';

@Component({
  selector: 'app-statusbar',
  imports: [],
  templateUrl: './statusbar.html',
  styleUrl: './statusbar.scss',
})
export class Statusbar { 
  @Input() activeMode: mode = "Normal";
  activeInfo: string = "Nothing selected";
}
