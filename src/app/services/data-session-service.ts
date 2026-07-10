import { computed, inject, Injectable, signal } from '@angular/core';
import { FastaRecord, SearchResult } from '../types/main_types';
import { LINE_WIDTH } from './sequence-viewer-service';
import { UserDataService } from './user-data';
import { NCBIDataService } from './ncbi-data-service';
import { QueryPacket } from '../types/side_types';

const DUMMY_SEQUENCE = `>DUMMY_ACE2 Homo sapiens ACE2 gene fragment [demo]
ATGTCAAGCTCTTCCTGGCTCCTTCTCAGCCTTGTTGCTGTAACTAAAACGGAAGTTTATAAACATCATC
ATGATGATGATAATGCAGCAGAGCAAGGAAATCATCAAATCCTGGAAACAGCTGAAGGAGTTAATGGAAT
TGGCAACAGCTGCAGATCCCAAAGAAGCTGATGAGACAGAAAAGCTCATGAAGAGGTTCAAGAAGGAAAA
AGAGAAAGAAGAGAAAGAGAAAGAACAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGC
AGCAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGACGGTTC
TGCAGCTCCAGTTCCCAGCTACAGCCCAGCAGTTCCAGCTGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAG
CAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCA
GCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGC`;

@Injectable({
  providedIn: 'root',
})
export class DataSessionService {
  readonly userData = inject(UserDataService);
  readonly ncbi     = inject(NCBIDataService);

  readonly userName          = computed<string>(()  => this.userData._USER_NAME());
  readonly isApiKeyAvailable = computed<boolean>(() => this.userData._API_KEY() !== null);
  readonly config_path       = computed<string>(()  => this.userData._SCRAMBLE_CONFIG());
  readonly loadedFastas      = signal<FastaRecord[]>([]);


  constructor() {
    this.parseFasta(DUMMY_SEQUENCE);
  }

  parseFasta(raw: string) {
    let current: FastaRecord | null = null;

    for (const rawLine of raw.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (line.startsWith('>')) {
        if (current) this.loadedFastas().push(current);
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
    if (current) this.loadedFastas().push(current);
  }

  search(query: string, fastaRecordIdx: number, where: keyof FastaRecord = "sequence"): SearchResult {
    const result: SearchResult = { status: "Fail", value: []};
    if (fastaRecordIdx > this.loadedFastas().length - 1 || fastaRecordIdx < 0) return result;
    if (!query) return result;
    const rec = this.loadedFastas()[fastaRecordIdx];
    let searchItem = '';
    switch (where) {
      case 'header':   searchItem += rec.header; break;
      case 'comments': rec.comments.forEach(comment => {searchItem += comment}); break;
      case 'sequence': searchItem = rec.sequence; break;  // This seems very inefficient
    }
    if (!searchItem) return result;

    let idxStart = 0;
    const maxIdx = searchItem.length - query.length;
    while (idxStart < maxIdx) {
      idxStart = searchItem.indexOf(query, idxStart);
      if (idxStart < 0) break;
      result.status = "Pass";
      if (where === "sequence") {
        result.value.push({
          row: Math.floor(idxStart/LINE_WIDTH),
          col: idxStart % LINE_WIDTH,
          offset: idxStart
        });
        idxStart++;
        continue;
      }
      break;
    }
    return result;
  }

  getFromQuery(q: QueryPacket){
    return this.ncbi.createUrl(q);
  }
}
