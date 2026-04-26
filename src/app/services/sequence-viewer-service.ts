import { Injectable, signal, computed } from '@angular/core';
import { CursorPos, EditorMode, sequence, VisualSelection, FastaRecord } from '../types/main_types';
import { HighlightArea } from '../types/cmd_types';

export const LINE_WIDTH = 120;

function parseFasta(raw: string): FastaRecord[] {
  const records: FastaRecord[] = [];
  let current: FastaRecord | null = null;

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith('>')) {
      if (current) records.push(current);
      current = {
        header: line.slice(1).trim(),
        comments: [],
        sequence: ''
      };
    } else if (line.startsWith(';')) {
      if (current) {
        current.comments.push(line.slice(1).trim());
      }
    } else if (line.length > 0) {
      if (current) {
        current.sequence += line.replace(/\s/g, '').toUpperCase();
      }
    }
  }
  if (current) records.push(current);
  return records;
}

@Injectable({
  providedIn: 'root',
})
export class SequenceViewerService {
  readonly records = signal<FastaRecord[]>([]);
  readonly activeRecordIdx = signal<number>(0);

  readonly activeRecord = computed<FastaRecord | null>(() => {
    const recs = this.records();
    const idx  = this.activeRecordIdx();
    return recs[idx] ?? null;
  });

  readonly sequence = signal<sequence>('');
  readonly header   = signal<string>('');
  readonly comments = signal<string[]>([]);

  readonly mode = signal<EditorMode>('Normal');
  readonly cursorOffset = signal<number>(0);
  readonly visualAnchor = signal<number | null>(null);
  readonly hlAreas = signal<HighlightArea[]>([]);

  readonly lines = computed<string[]>(() => {
    const seq = this.sequence();
    if (!seq.length) return [];
    const result: string[] = [];
    for (let i = 0; i < seq.length; i += LINE_WIDTH) {
      result.push(seq.slice(i, i + LINE_WIDTH));
    }
    return result;
  });

  readonly totalLines = computed(() => this.lines().length);

  readonly cursorPos = computed(() => {
    const offset = this.cursorOffset();
    return {
      row: Math.floor(offset/LINE_WIDTH),
      col: offset % LINE_WIDTH,
      offset
    }
  });

  readonly visualSelection = computed<VisualSelection | null>(() => {
    const anchor = this.visualAnchor();
    if (anchor === null) return null;
    return { anchorOffset: anchor, activeOffset: this.cursorOffset()}
  });

  //-----------------------------
  loadFasta(raw: sequence): void {
    const parsed = parseFasta(raw);
    this.records.set(parsed);
    this.selectRecord(0);
  }

  selectRecord(index: number): void {
    const recs = this.records();
    if (index < 0 || index >= recs.length) return;

    this._commitSequence();

    this.activeRecordIdx.set(index);
    const rec = recs[index];
    this.sequence.set(rec.sequence);
    this.header.set(rec.header);
    this.comments.set(rec.comments);

    this.cursorOffset.set(0);
    this.mode.set('Normal');
    this.visualAnchor.set(null);
  }

  loadSequence(sequence: sequence, header = '', comments: string[] = []){
    this.records.set([{header, comments, sequence}]);
    this.selectRecord(0);
  }

  //--------Cursor Movement---------
  moveCursor(delta: number): void {
    const next = Math.max(0, Math.min(this.sequence().length -1, this.cursorOffset() + delta))
    this.cursorOffset.set(next);
  }
  jumpTo(absOffset: number): void {
    this.cursorOffset.set(absOffset);
  }
  moveToLineStart(): void {
    const { row } = this.cursorPos();
    this.cursorOffset.set(row * LINE_WIDTH);
  }
  moveToLineEnd(): void {
    const { row } = this.cursorPos();
    const lineStr = this.lines()[row] ?? '';
    this.cursorOffset.set(row * LINE_WIDTH + lineStr.length - 1);
  }
  moveToStart(): void {
    this.cursorOffset.set(0);
  }
  moveToEnd(): void {
    this.cursorOffset.set(Math.max(0, this.sequence().length - 1));
  }

  setMode(mode: EditorMode) {
    if (mode === "Visual") {
      this.visualAnchor.set(this.cursorOffset());
    } else {
      this.visualAnchor.set(null);
    }
    this.mode.set(mode);
  }

  search(query: string): Boolean {
    return false;
  }
  //------Editing--------
  insertAt(offset: number, char: string): void {
    this.sequence.update(seq => 
      seq.slice(0, offset) + char.toUpperCase() + seq.slice(offset)
    );
    this.moveCursor(+1);
    this._commitSequence();
  }
  deleteAt(offset: number) {
    const length = this.sequence().length;
    if (!length) return;
    this.sequence.update(seq => seq.slice(0, offset) + seq.slice(offset + 1));
    this.cursorOffset.set(Math.min(offset, length - 2));
    this._commitSequence();
  }
  replaceAt(offset: number, char: string): void {
    this.sequence.update(seq => {
      return seq.slice(0, offset) + char.toUpperCase() + seq.slice(offset + 1);      
    });
    this._commitSequence();
  }
  deleteSelection(): void {
    const sel = this.visualSelection();
    if(!sel) return;
    const from = Math.min(sel.anchorOffset, sel.activeOffset);
    const to   = Math.max(sel.anchorOffset, sel.activeOffset);
    const seq  = this.sequence();
    this.sequence.update(seq => seq.slice(0, from) + seq.slice(to));
    this.cursorOffset.set(Math.max(0, from));
    this.setMode("Normal");
    this._commitSequence();
  }
    
  private _commitSequence(): void {
    const index = this.activeRecordIdx();
    this.records.update(recs => {
      const updated = [...recs];
      updated[index] = {
        ...updated[index],
        sequence: this.sequence()
      };
      return updated;
    });
  }
}




