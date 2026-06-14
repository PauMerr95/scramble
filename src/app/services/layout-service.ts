import { Injectable, signal, inject } from '@angular/core';
import { NavbarLocation, FocusLocation, QueryPage, NotificationObject, ActiveNotification, ModalObject } from '../types/layout_types';
import { MoveGrid, SelectableLocation } from '../types/side_types';
import { CursorPos } from '../types/main_types';
import { Router } from '@angular/router';
import { Avatar } from '../types/side_types';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private _sidePaneState = signal<NavbarLocation>("Hidden");
  private _queryPage = signal<QueryPage>("QueryMain");
  private _currentFocus = signal<FocusLocation | null>(null);
  private _currentMoveGrid = signal<MoveGrid | null>(null)
  private _selector = signal<CursorPos | null>(null)
  private readonly _router = inject(Router);

  private _notificationIDCounter = 0;
  private _notificationQueue = signal<NotificationObject[]>([])
  readonly activeNotifications = signal<ActiveNotification[]>([])
  readonly activeModal = signal<ModalObject | null>(null);
  readonly activeAvatar = signal<Avatar>("Sheep");

  readonly sidePaneState = this._sidePaneState.asReadonly();
  readonly currentFocus = this._currentFocus.asReadonly();
  readonly queryPage = this._queryPage.asReadonly();

  private _drainQueue() {
    const openSlots = 4 - this.activeNotifications().length;
    if (openSlots <= 0) return;
    const q = this._notificationQueue();
    const add = q.slice(0, openSlots).map(n => ({...n, id: this._notificationIDCounter++}))
    this._notificationQueue.update(q => q.slice(add.length));
    this.activeNotifications.update(active => [...active, ...add]);
  }

  currentlyTargeted(): null | SelectableLocation{
    if (!this._currentMoveGrid() || !this._selector()) return null;
    return this._currentMoveGrid()![this._selector()!.row][this._selector()!.col];
  }

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
    if (!this._selector()) {
      this._selector.set({row: 0, col: 0, offset: 0});
    }
    this._currentMoveGrid.set(grid);
    this.checkRow();
    this.checkColumn();
  }
  unloadGrid() {
    this._selector.set(null);
    this._currentMoveGrid.set(null);
  }

  moveDown() { 
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.row >= this._currentMoveGrid()!.length - 1) return;
    const row = this._selector()!.row;
    const col = this._selector()!.col;
    let moves = this._currentMoveGrid()![row!].length - col!;
    this._selector()!.row++;
    this.checkColumn();
    moves += this._selector()!.col;
    this._selector()!.offset += moves;
    console.log(`Row: ${this._selector()!.row}, Col: ${this._selector()!.col},  Offset: ${this._selector()!.offset}, Target: ${String(this.currentlyTargeted())}`);
  }
  moveUp() { 
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.row <= 0) return;
    let moves = this._selector()!.col;
    this._selector()!.row--;
    this.checkColumn();
    moves += this._currentMoveGrid()![this._selector()!.row].length - this._selector()!.col;
    this._selector()!.offset -= moves;
    console.log(`Row: ${this._selector()!.row}, Col: ${this._selector()!.col}, Offset: ${this._selector()!.offset}, Target: ${String(this.currentlyTargeted())}`);
  }
  moveLeft() {
    if (!this._currentMoveGrid() || !this._selector()) return;
    if (this._selector()!.col <= 0) return;
    this._selector()!.col--;
    this._selector()!.offset--;
    console.log(`row: ${this._selector()!.row}, col: ${this._selector()!.col}, offset: ${this._selector()!.offset}`);
  }
  moveRight() {
    if (!this._currentMoveGrid() || !this._selector()) return;
    const row = this._selector()!.row;
    if (this._currentMoveGrid()![row].length - 1 <= this._selector()!.col) return;
    this._selector()!.col++;
    this._selector()!.offset++;
    console.log(`row: ${this._selector()!.row}, col: ${this._selector()!.col}, offset: ${this._selector()!.offset}`);
  }

  jumpToOffset(offset: number){
    if (!this._currentMoveGrid() || !this._selector()) return;
    console.log("Movegrid and selector are valid");
    if (!offset || offset <= 0) {
      console.log("Move to start intentionally");
      this._selector.set({row: 0, col: 0, offset: 0});
    }
    let deltaOff = offset - this._selector()!.offset;
    console.log(`Delta Off: ${deltaOff}`);
    while (deltaOff !== 0) {
      const row = this._selector()!.row;
      const col = this._selector()!.col;
      deltaOff = offset - this._selector()!.offset;
      console.log(`Delta Off: ${deltaOff}`);
      if (deltaOff < 0) {
        if (deltaOff*-1 > col) {
          this.moveUp();
        } else {
          this.moveLeft();
        }
      } else {
        if (deltaOff >= this._currentMoveGrid()![row].length - col) {
          if (row === this._currentMoveGrid()!.length - 1) break; // Can't reach offset
          this.moveDown();
        } else {
          if (col === this._currentMoveGrid()![row].length - 1) break; // Cant'reach offset
          this.moveRight();
        } 
      }
    // Fails silently when jumpToOffset is not feasable 
    }
  }
  checkRow(){
    const row = this._selector()!.row;
    const maxRow = this._currentMoveGrid()!.length - 1;
    if (row > maxRow) {
      this._selector()!.row = maxRow;
    }
  }
  checkColumn(){
    const row = this._selector()!.row;
    const maxCol = this._currentMoveGrid()![row].length - 1;
    if (this._selector()!.col > maxCol) {
      this._selector()!.col = maxCol;
    }
  }
  changeQueryPage(newPage: QueryPage) {
    this._queryPage.set(newPage);
  }

  handleEnter() {
    if (this._sidePaneState() === "Query") {
      switch (this.currentlyTargeted()) {
        case "IconQueryGenome":    this.changeQueryPage("Genome"); break;
        case "IconQueryGene":      this.changeQueryPage("Gene"); break;
        case "IconQueryProkaryot": this.changeQueryPage("Prokaryot"); break;
        case "IconQueryVirus":     this.changeQueryPage("Virus"); break;
        case "IconQueryOrganelle": this.changeQueryPage("Organelle"); break;
      }
    }
    if (this._sidePaneState() === "Profile") {
      switch (this.currentlyTargeted()){
        case "ProfileAvatar":
          this.openModal({title: "Avatar Selection", route: 'modal/avatars'});
      }
    }
  }

  notify(notification: NotificationObject){
    console.log(`Triggering notification => kind: ${notification.kind} | message: ${notification.message}`);
    this._notificationQueue.update((q) => [...q, notification]);
    this._drainQueue();
  }

  dismissNotification(id: number) {
    this.activeNotifications.update(
      active => active.filter(notification => notification.id != id)
    );
    this._drainQueue();
  }

  openModal(modal: ModalObject) {
    this.activeModal.set(modal);
    this._router.navigateByUrl(modal.route);
  }
  closeModal(){
    this.activeModal.set(null);
    this._router.navigateByUrl('/');
  }
}
