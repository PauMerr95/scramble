import { Injectable, signal, inject, computed } from '@angular/core';
import { NavbarLocation, FocusLocation, QueryPage, NotificationObject, ActiveNotification, ModalObject } from '../types/layout_types';
import { MoveGrid, SelectableLocation } from '../types/side_types';
import { CursorPos } from '../types/main_types';
import { Router } from '@angular/router';
import { Avatar } from '../types/side_types';
import { Theme } from '../types/layout_types';
import * as mvgSide from '../move-grids/mv-grids-sidePane';
import * as mvgModal from '../move-grids/mv-grids-modals';
import { UserDataService } from './user-data';

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
  readonly activeAvatar = computed(() => {
    return this.user.data().avatar as Avatar;
  });

  readonly sidePaneState = this._sidePaneState.asReadonly();
  readonly currentFocus = this._currentFocus.asReadonly();
  readonly queryPage = this._queryPage.asReadonly();

  readonly currentTheme = signal<Theme>("DarkLime");

  readonly user = inject(UserDataService);

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
    if (this.currentFocus() === "SidePane") {
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
            this.openModal({title: "AvatarMenu", route: 'modal/avatars'});
        }
      }
    } else if (this.currentFocus() === "Modal"){
        switch(this.activeModal()!.title) {
          case "AvatarMenu": this.changeAvatar(this.currentlyTargeted()!); this.closeModal(); break
      }
    }
  }

  changeAvatar(newAvatar: Avatar) {
    this.user.updateUserInfo({avatar: newAvatar});
  }
  updateTheme() {
    const newTheme = this.currentTheme();
    this.user.updateUserInfo({theme: newTheme});
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
    this.focusOn("Modal");
  }
  closeModal(){
    this.activeModal.set(null);
    this._router.navigateByUrl('/');
    this.focusOn("MainPane");
  }

  dbg() {
    return `
      === Layout Service Debug Information ===
      active Focus:      ${this.currentFocus()},\n
      Side Pane Status:  ${this.sidePaneState()},\n
      Query Page Status: ${this.queryPage()},\n
      MoveGrid:          ${this._currentMoveGrid()},\n
      Selector:          ROW: ${this._selector()?.row} | COL: ${this._selector()?.col} | OFF: ${this._selector()?.offset},\n
      Targeted:          ${this.currentlyTargeted()},
      NotificationQueue: ${this._notificationQueue()},\n
      Active Avatar:     ${this.activeAvatar()},\n
    `
  }
}