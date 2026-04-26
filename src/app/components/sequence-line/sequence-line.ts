import { 
  Component,
  ViewEncapsulation,
  input,
  computed
} from '@angular/core';
import { EditorMode, VisualSelection } from '../../types/main_types';
import { LINE_WIDTH } from '../../services/sequence-viewer-service';

@Component({
  selector: 'app-sequence-line',
  imports: [],
  templateUrl: './sequence-line.html',
  styleUrl: './sequence-line.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SequenceLine {
  readonly line = input<string>('');
  readonly lineIndex = input<number>(0);
  readonly cursorOffset = input<number | null>(null);
  readonly mode = input<EditorMode>('Normal');
  readonly visualSelection = input<VisualSelection | null>(null);

  readonly lineNumberDisplay = computed(() => {
    return String(this.lineIndex() * LINE_WIDTH + 1);
  });
  
  readonly lineHtml = computed(() => {
    const line = this.line();
    const lineIndex = this.lineIndex();
    const cursorOffset = this.cursorOffset();
    const mode = this.mode();
    const visualSelection = this.visualSelection();

    return Array.from(line).map((base, idx) => {
      const absOffset = lineIndex * LINE_WIDTH + idx;
      const classes = [
        baseClass(base),
        cursorClass(absOffset, cursorOffset, mode),
        isSelected(absOffset, visualSelection) ? 'selected' : ''
      ].filter(Boolean).join(' ');
      return `<span class="${classes}">${base}</span>`
    }).join('');
  });

  get hasCursorOrSelection(): boolean {
    const lineOffset = this.lineIndex() * LINE_WIDTH;
    if (this.cursorOffset !== null) return true;
    if (!this.visualSelection) return false;
    const from = Math.min(this.visualSelection()!.anchorOffset, this.visualSelection()!.activeOffset);
    const to   = Math.max(this.visualSelection()!.anchorOffset, this.visualSelection()!.activeOffset);
    const lineEnd = lineOffset + this.line.length;
    return (from <= lineEnd && to >= lineOffset);
  }

}

function baseClass(base: string): string {
  switch (base) {
    case 'A': return 'base-A';
    case 'G': return 'base-G';
    case 'C': return 'base-C';
    case 'T': return 'base-T';
    default: return 'base-wildcard';
  }
}
function cursorClass(absOffset: number, cursorOffset: number | null, mode: EditorMode): string {
  if (cursorOffset === null || absOffset !== cursorOffset) return '';
  switch (mode) {
    case 'Normal':  return 'cursor-normal';
    case 'Insert':  return 'cursor-insert';
    case 'Replace': return 'cursor-replace';
    case 'Visual':  return 'cursor-normal';
  }
}
function isSelected(absOffset: number, visualSelection: VisualSelection | null): boolean {
  if (!visualSelection) return false;
  const from = Math.min(visualSelection.anchorOffset, visualSelection.activeOffset);
  const to   = Math.max(visualSelection.anchorOffset, visualSelection.activeOffset);
  return absOffset >= from && absOffset <= to;
}