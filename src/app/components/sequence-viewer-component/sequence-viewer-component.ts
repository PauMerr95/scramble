import { 
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SequenceViewerService, LINE_WIDTH } from '../../services/sequence-viewer-service';
import { SequenceLine } from '../sequence-line/sequence-line';
import { Statusbar } from '../statusbar/statusbar';
import { CmdLineService } from '../../services/cmd-line-service';
import { LayoutService } from '../../services/layout-service';

const DUMMY_SEQUENCE = `>DUMMY_ACE2 Homo sapiens ACE2 gene fragment [demo]
ATGTCAAGCTCTTCCTGGCTCCTTCTCAGCCTTGTTGCTGTAACTAAAACGGAAGTTTATAAACATCATC
ATGATGATGATAATGCAGCAGAGCAAGGAAATCATCAAATCCTGGAAACAGCTGAAGGAGTTAATGGAAT
TGGCAACAGCTGCAGATCCCAAAGAAGCTGATGAGACAGAAAAGCTCATGAAGAGGTTCAAGAAGGAAAA
AGAGAAAGAAGAGAAAGAGAAAGAACAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGC
AGCAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGACGGTTC
TGCAGCTCCAGTTCCCAGCTACAGCCCAGCAGTTCCAGCTGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAG
CAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCA
GCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGC`;

export const ITEM_SIZE_PX = 22;

@Component({
  selector: 'app-sequence-viewer-component',
  imports: [ScrollingModule, SequenceLine],
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

  ngOnInit(): void {
    this.sqv.loadFasta(DUMMY_SEQUENCE);
  }

  ngAfterViewInit(): void {
    this.shell.nativeElement.focus();
  }

  cursorOnLine(lineIndex: number): number | null {
    const pos = this.sqv.cursorPos();
    return pos.row === lineIndex ? pos.offset : null;
  }

  // -------- Keyboard Inputs ---------
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent){
    const mode = this.sqv.mode();

    if (e.key === 'Escape') {
      this.sqv.setMode('Normal');
      e.preventDefault;
      return;
    }

    switch (mode) {
      case "Normal":  this.handleNormal(e); break;
      case "Insert":  this.handleInsert(e); break;
      case "Replace": this.handleReplace(e); break;
      case "Visual":  this.handleVisual(e); break;
    }
    this.scrollToCursor();
  }

  private handleNormal(e: KeyboardEvent) {
      switch (e.key) {
      case 'h': case 'ArrowLeft':  this.sqv.moveCursor(-1);         break;
      case 'l': case 'ArrowRight': this.sqv.moveCursor(+1);         break;
      case 'j': case 'ArrowDown':  this.sqv.moveCursor(+LINE_WIDTH);break;
      case 'k': case 'ArrowUp':    this.sqv.moveCursor(-LINE_WIDTH);break;
      case 'w':                    this.sqv.moveCursor(+3);        break;
      case 'b':                    this.sqv.moveCursor(-3);        break;
      case '0': case '^':          this.sqv.moveToLineStart();      break;
      case '$':                    this.sqv.moveToLineEnd();        break;
      case 'g':                    this.sqv.moveToStart();          break;
      case 'G':                    this.sqv.moveToEnd();            break;
      case 'i': this.sqv.setMode('Insert');  break;
      case 'a': this.sqv.moveCursor(+1); this.sqv.setMode('Insert'); break;
      case 'r': this.sqv.setMode('Replace'); break;
      case 'v': this.sqv.setMode('Visual');  break;
      case 'x': this.sqv.deleteAt(this.sqv.cursorPos().offset); break;
      case ' ': {
        this.lyt.focusOn("CmdLine");
        this.cli.handleInput("Leader");
        break; 
      }
      case '/': { 
        this.lyt.focusOn("CmdLine");
        this.cli.handleInput("Search");
        break; 
      }
      case ':': {
        this.lyt.focusOn("CmdLine");
        this.cli.handleInput("Command");
        break; 
      }
      default: return; 
    }
    e.preventDefault();
  }

  private handleInsert(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowLeft':  this.sqv.moveCursor(-1);          e.preventDefault(); break;
      case 'ArrowRight': this.sqv.moveCursor(+1);          e.preventDefault(); break;
      case 'ArrowDown':  this.sqv.moveCursor(+LINE_WIDTH); e.preventDefault(); break;
      case 'ArrowUp':    this.sqv.moveCursor(-LINE_WIDTH); e.preventDefault(); break;
      case 'Backspace':
        this.sqv.deleteAt(this.sqv.cursorPos().offset - 1); e.preventDefault(); break;
      case 'Delete':
        this.sqv.deleteAt(this.sqv.cursorPos().offset); e.preventDefault(); break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const char = e.key.toUpperCase();
          if ('ATGCMRWSYKVHDBXZN'.includes(char)) {
            this.sqv.insertAt(this.sqv.cursorPos().offset, char);
          }
          e.preventDefault();
        }
    }
  }
  private handleReplace(e: KeyboardEvent): void {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const char = e.key.toUpperCase();
      if ('ATGCMRWSYKVHDBXZN'.includes(char)) {
        this.sqv.replaceAt(this.sqv.cursorPos().offset, char);
        this.sqv.moveCursor(+1);
      }
      this.sqv.setMode('Normal');
      e.preventDefault();
    } else {
      switch (e.key) {
        case 'ArrowLeft':  this.sqv.moveCursor(-1);          e.preventDefault(); break;
        case 'ArrowRight': this.sqv.moveCursor(+1);          e.preventDefault(); break;
        case 'ArrowDown':  this.sqv.moveCursor(+LINE_WIDTH); e.preventDefault(); break;
        case 'ArrowUp':    this.sqv.moveCursor(-LINE_WIDTH); e.preventDefault(); break;
      }
    }
  } 

  private handleVisual(e: KeyboardEvent): void {
    switch (e.key) {
      case 'h': case 'ArrowLeft':  this.sqv.moveCursor(-1);          break;
      case 'l': case 'ArrowRight': this.sqv.moveCursor(+1);          break;
      case 'j': case 'ArrowDown':  this.sqv.moveCursor(+LINE_WIDTH); break;
      case 'k': case 'ArrowUp':    this.sqv.moveCursor(-LINE_WIDTH); break;
      case 'w':                    this.sqv.moveCursor(+2);        break;
      case 'b':                    this.sqv.moveCursor(-2);        break;
      case '0': case '^':          this.sqv.moveToLineStart();      break;
      case '$':                    this.sqv.moveToLineEnd();        break;
      case 'g':                    this.sqv.moveToStart();          break;
      case 'G':                    this.sqv.moveToEnd();            break;
      case 'x': case 'd':          this.sqv.deleteSelection();       break;
      default: return;
    }
    e.preventDefault();
  }
  prevRecord(): void { this.sqv.selectRecord(this.sqv.activeRecordIdx() - 1); }
  nextRecord(): void { this.sqv.selectRecord(this.sqv.activeRecordIdx() + 1); }
 
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

}
