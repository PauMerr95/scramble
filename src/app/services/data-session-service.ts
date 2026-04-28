import { inject, Injectable, signal } from '@angular/core';
import { FastaRecord } from '../types/main_types';

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
  readonly loadedFastas = signal<FastaRecord[]>([]);

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
}
