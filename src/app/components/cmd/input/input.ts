import { Component, ElementRef, inject, viewChild, effect, afterRenderEffect } from '@angular/core';
import { LayoutService } from '../../../services/layout-service';
import { CmdLineService } from '../../../services/cmd-line-service';
import { IconSearch } from "../../icons/search";
import { IconIdle } from "../../icons/idle";
import { IconLeader } from '../../icons/leader';
import { IconCommand } from '../../icons/command';

@Component({
  selector: 'app-input',
  imports: [IconIdle, IconLeader, IconSearch, IconCommand],
  template: `
    @if (this.cli.cmdInputType() === null) {
      <app-icon-idle class="icon" svg_color="#55dc48"></app-icon-idle>
    }
    @if (this.cli.cmdInputType() === "Command") {
      <app-icon-command class="icon" svg_color="#55dc48"></app-icon-command>
    }
    @if (this.cli.cmdInputType() === "Leader") {
      <app-icon-leader class="icon" svg_color="#55dc48"></app-icon-leader>
    }
    @if (this.cli.cmdInputType() === "Search") {
      <app-icon-search class="icon" svg_color="#55dc48"></app-icon-search>
    }
    <input #cmdInput class='cmd-input-field' type=text (keydown)="onKey($event)"/>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px
    }
    .icon {
      display: flex;
    }
    .cmd-input-field {
      width: 100%;
      max-height: 20px;
      color: var(--cmd-fg, #55dc48);
      background: var(--cmd-bg, #181825);
      border: 0;
      font-family: 'Fira Mono', 'Cascadia Code', 'Jetbrains Mono', 'Ubuntu Mono', 'SF Mono', 'Consolas';
      font-size: 16px;
      padding-bottom: 2px;
    }
    .cmd-input-field:hover {
      cursor: default;
    }
    .cmd-input-field:focus {
      outline: none;
    }
  `,
})
export class CmdInput {
  protected readonly lyt = inject(LayoutService);
  protected readonly cli = inject(CmdLineService);
  private readonly _inputRef = viewChild.required<ElementRef<HTMLInputElement>>('cmdInput');

  constructor() {
    afterRenderEffect(() => {
      const el = this._inputRef().nativeElement;
      el.onclick = null;
      el.addEventListener('mousedown', (e) => e.preventDefault());
    });
    effect(() => {
      if (this.lyt.currentFocus() === "CmdLine") {
        this._inputRef().nativeElement.focus();
      }
    });
  }

  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.cli.abort();
    }
    if (this.cli.cmdInputType() === "Leader") {
      this.cli.cmdInput.update(cmd => {
        if (cmd) {
          if (e.key === 'Delete') return cmd.slice();
          return cmd + e.key;
        }
        return e.key;
      });
      this.cli.checkLeader();
      return;
    }
    if (e.key === "Enter") {
      if (this.cli.cmdInputType() === "Search") {
        this.cli.checkSearch();
        return;
      }
      this.cli.checkCommand();
    }
  }
}
