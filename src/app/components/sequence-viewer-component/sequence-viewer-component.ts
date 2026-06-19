import { 
  Component,
  effect,
  ElementRef,
  HostListener,
  ViewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SequenceViewerService, LINE_WIDTH } from '../../services/sequence-viewer-service';
import { SequenceLine } from '../sequence-line/sequence-line';
import { CmdLineService } from '../../services/cmd-line-service';
import { LayoutService } from '../../services/layout-service';



export const ITEM_SIZE_PX = 22;

@Component({
  selector: 'app-sequence-viewer-component',
  imports: [CdkVirtualScrollViewport, ScrollingModule, SequenceLine],
  templateUrl: './sequence-viewer-component.html',
  styleUrl: './sequence-viewer-component.scss',
})
export class SequenceViewerComponent {
  constructor(
    readonly sqv: SequenceViewerService,
    readonly cli: CmdLineService,
    readonly lyt: LayoutService){
      effect(() => {
        if (this.lyt.currentFocus() === "MainPane") this.shell.nativeElement.focus();
      });
    }

  readonly lineWidth = LINE_WIDTH;
  readonly itemSizePx = ITEM_SIZE_PX;
  @ViewChild('viewport') viewport!: CdkVirtualScrollViewport;
  @ViewChild('shell')    shell!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.shell.nativeElement.focus();
    this.lyt.focusOn("MainPane");
  }

  cursorOnLine(lineIndex: number): number | null {
    const pos = this.sqv.cursorPos();
    return pos.row === lineIndex ? pos.offset : null;
  }

  prevRecord(): void { this.sqv.selectRecord(this.sqv.activeRecordIdx() - 1); }
  nextRecord(): void { this.sqv.selectRecord(this.sqv.activeRecordIdx() + 1); }
 
  /* DEPRECATED - MOVE TO DESIGNATED SERVICE
    private scrollToCursor(): void {
    const line = this.sqv.cursorPos().row;
    const scrollTop = this.viewport.measureScrollOffset('top');
    const viewportHeight = this.viewport.getViewportSize();
    const itemTop    = line * this.itemSizePx;
    const itemBottom = itemTop + this.itemSizePx;
 
    if (itemTop < scrollTop) {
      this.viewport.scrollToOffset(itemTop - this.itemSizePx * 2, 'smooth');
    } else if (itemBottom > scrollTop + viewportHeight) {
      this.viewport.scrollToOffset(itemBottom - viewportHeight + this.itemSizePx * 2, 'smooth');
    }
  }
  */
}
