import { Injectable, signal } from '@angular/core';
import { NavbarLocation, FocusLocation } from '../types/navbar_locations';
import { SidePane } from '../components/side-pane/side-pane';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private _sidePaneState = signal<NavbarLocation>("Hidden");
  private _currentFocus = signal<FocusLocation | null>(null);

  readonly sidePaneState = this._sidePaneState.asReadonly();
  readonly currentFocus = this._currentFocus.asReadonly();


  toggleSidePane(location: NavbarLocation) {
    this._sidePaneState.update((currState) => {
      if (currState === location) return "Hidden";
      return location;
    });
    this._currentFocus.set("SidePane");
  }

  focusOn(foc: FocusLocation | null) {
    this._currentFocus.set(foc);
  }
}
