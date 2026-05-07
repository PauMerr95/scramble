import { Injectable, signal } from '@angular/core';
import { NavbarLocation, FocusLocation } from '../types/navbar_locations';
import { MoveGrid } from '../components/side-pane/side_types';
import { CursorPos } from '../types/main_types';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private _sidePaneState = signal<NavbarLocation>("Hidden");
  private _currentFocus = signal<FocusLocation | null>(null);
  private _currentMoveGrid = signal<MoveGrid | null>(null)
  private _selector = signal<CursorPos | null>(null)

  readonly sidePaneState = this._sidePaneState.asReadonly();
  readonly currentFocus = this._currentFocus.asReadonly();


  toggleSidePane(location: NavbarLocation) {
    this._sidePaneState.update((currState) => {
      if (currState === location) return "Hidden";
      return location;
    });
    (this._sidePaneState() === "Hidden") ? this._currentFocus.set("MainPane") : this._currentFocus.set("SidePane");
  }

  focusOn(foc: FocusLocation | null) {
    this._currentFocus.set(foc);
  }

  loadGrid(grid: MoveGrid){
    this._selector.set({row: 0, col: 0, offset: 0});
    this._currentMoveGrid.set(grid);
  }
  unloadGrid() {
    this._selector.set(null);
    this._currentMoveGrid.set(null);
  }

  get currentlySelectedItem() {
    if (!this._currentMoveGrid() || !this._selector()) return null;
    return this._currentMoveGrid()![this._selector()!.row][this._selector()!.col];
  }
  moveDown() { 
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.row >= this._currentMoveGrid()!.length - 1) return;
    this._selector()!.row++;
    this.checkColumn();
    console.log(`Row: ${this._selector()!.row}, Col: ${this._selector()!.col}, Target: ${String(this.currentlySelectedItem)}`);
  }
  moveUp() { 
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.row <= 0) return;
    this._selector()!.row--;
    this.checkColumn();
    console.log(`Row: ${this._selector()!.row}, Col: ${this._selector()!.col}, Target: ${String(this.currentlySelectedItem)}`);
  }
  moveLeft() {
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.col <= 0) return;
    this._selector()!.col--;
  }
  moveRight() {
    if (!this._currentMoveGrid() || !this._selector()) return;
    const row = this._selector()!.row;
    if (this._currentMoveGrid()![row].length - 1 <= this._selector()!.col) return;
    this._selector()!.col++;
  }
  checkColumn(){
    const row = this._selector()!.row;
    const maxCol = this._currentMoveGrid()![row].length - 1;
    if (this._selector()!.col > maxCol) {
      this._selector()!.col = maxCol;
    }
  }
}
