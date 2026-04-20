import { Component, signal } from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { SidePane } from "./components/side-pane/side-pane";
import { navbarLocation } from './components/navbar/navbar_locations';
import { Statusbar } from "./components/statusbar/statusbar";
import { mode } from './components/statusbar/modes';

@Component({
  selector: 'app-root',
  imports: [Navbar, SidePane, Statusbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('scramble');
  sidePaneStatus: navbarLocation | "hidden" = "hidden";
  activeMode: mode = "Normal";

  toggleSidePane(location: navbarLocation | "hidden"){
    if (location === this.sidePaneStatus) {
      document.getElementById("app-wrapper-id")?.classList.remove(this.sidePaneStatus);
      document.getElementById("app-wrapper-id")?.classList.add("hidden");
      this.sidePaneStatus = "hidden";
    } else {
      document.getElementById("app-wrapper-id")?.classList.remove(this.sidePaneStatus);
      document.getElementById("app-wrapper-id")?.classList.add(location);
      this.sidePaneStatus = location;
    }
  }

  switchMode(mode: mode) {
    this.activeMode = mode;
  }
}
