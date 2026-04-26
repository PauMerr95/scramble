import { Component, signal, inject } from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { SidePane } from "./components/side-pane/side-pane";
import { MainPane } from "./components/main-pane/main-pane";
import { NavbarLocation } from './types/navbar_locations';
import { Statusbar } from "./components/statusbar/statusbar";
import { EditorMode } from './types/main_types';
import { CmdLine } from "./components/cmd/cmd-line/cmd-line";
import { CmdLineService } from './services/cmd-line-service';
import { LayoutService } from './services/layout-service';

@Component({
  selector: 'app-root',
  imports: [Navbar, SidePane, Statusbar, MainPane, CmdLine],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('scramble');
  protected readonly layout = inject(LayoutService);
  activeMode: EditorMode = "Normal";

  switchMode(mode: EditorMode) {
    this.activeMode = mode;
  }
}
