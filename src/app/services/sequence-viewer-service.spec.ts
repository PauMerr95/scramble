import { TestBed } from '@angular/core/testing';
import { SequenceViewerService } from './sequence-viewer-service';
import { DataSessionService } from './data-session-service';
import { signal } from '@angular/core';
import { FastaRecord } from '../types/main_types';

const TEST_RECORD_1: FastaRecord = {
  header: "ACE2 Homo sapiens ACE2 gene fragment [demo]",
  comments: [],
  sequence:
    `ATGTCAAGCTCTTCCTGGCTCCTTCTCAGCCTTGTTGCTGTAACTAAAACGGAAGTTTATAAACATCATC
    ATGATGATGATAATGCAGCAGAGCAAGGAAATCATCAAATCCTGGAAACAGCTGAAGGAGTTAATGGAAT
    TGGCAACAGCTGCAGATCCCAAAGAAGCTGATGAGACAGAAAAGCTCATGAAGAGGTTCAAGAAGGAAAA
    AGAGAAAGAAGAGAAAGAGAAAGAACAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGC
    AGCAGCAGCAGCAGCAGCAGCAGCAACAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGACGGTTC
    TGCAGCTCCAGTTCCCAGCTACAGCCCAGCAGTTCCAGCTGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAG
    CAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCA
    GCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGC`
};
const TEST_RECORD_2: FastaRecord = {
  header: "ACE2 Homo sapiens ACE2 gene fragment of fragment [demo]",
  comments: ["Missing middle section", "Missing start codon"],
  sequence:
    `TCAAGCTCTTCCTGGCTCCTTCTCAGCCTTGTTGCTGTAACTAAAACGGAAGTTTATAAACATCATC
    ATGATGATGATAATGCAGCAGAGCAAGGAAATCATCAAATCCTGGAAACAGCTGAAGGAGTTAATGGAAT
    TGGCAACAGCTGCAGATCCCAAAGAAGCTGATGAGACAGAAAAGCTCATGAAGAGGTTCAAGAAGGAAAA
    TGCAGCTCCAGTTCCCAGCTACAGCCCAGCAGTTCCAGCTGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAG
    CAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCA
    GCAGCAGCAGCAGCAGCAGCAATACCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGC`
};

const test_records: FastaRecord[] = Array(TEST_RECORD_1, TEST_RECORD_2);

describe('SequenceViewerService', () => {
  let seq: SequenceViewerService;
  const mockedDataService = vi.fn(class {
    readonly userData = vi.fn();
    readonly ncbi     = vi.fn();
    readonly userName          = signal<string>("Unit Test User Name");
    readonly config_path       = signal<string>("fake/unit/test/path");
    readonly isApiKeyAvailable = signal<boolean>(true);
    readonly loadedFastas      = signal<FastaRecord[]>(test_records);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seq = TestBed.inject(SequenceViewerService);
  });

  it('should be created', () => {
    expect(seq).toBeTruthy();
  });
});
