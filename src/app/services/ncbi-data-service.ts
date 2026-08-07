import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryPacket,
         SelectectableQueryBy,
         SelectectableRetrieve,
         DataPacket,
         AnnotationReport,
         /*
         AnnotationDownloadSummary,
         AnnotationReportSummary,
         RevisionHistory,
         SequenceReports,
         DownloadSummary,
         AssemblyAccession,
         */
         CallerID,
         RegisteredQuery} from '../types/data_types';
import { v4 as uuidv4 } from 'uuid';

const apiDatasetsV2 = "https://api.ncbi.nlm.nih.gov/datasets/v2/";

const byExtension = new Map<SelectectableQueryBy, string>([
    ["Assembly Accession"  , 'genome/accession/'],
    ["Nucleotide Accession", 'genome/sequence_accession/'], // can only work with retrieving Assembly Accession
    ["Assembly Name"       , 'genome/assembly_name/'],      // can only work with retrieving Assembly Report
    ["BioProject Accession", 'genome/bioproject/'],         // can only work with retrieving Assembly Report
    ["BioSample Accession" , 'genome/biosample/'],          // can only work with retrieving Assembly Report
    ["Species Taxon"       , 'genome/taxon/'],
    ["WGS Accession"       , 'genome/wgs/']
]);
const getExtension = new Map<SelectectableRetrieve, string>([
  ["Annotation Report"          , 'annotation_report'],
  ["Annotation Data Package"    , 'annotation_report/download'],
  ["Annotation Download Summary", 'annotation_report/download_summary'],
  ["Annotation Report Summary"  , 'annotation_summary'],
  ["Revision History"           , 'revision_history'],
  ["Sequence Report"            , 'sequence_reports'],
  ["Assembly Report"            , 'dataset_report'],
  ["Data Package"               , 'download'],
  ["Download Summary"           , 'download_summary'],
  //INFO: Assembly Accession is a post request with { accession: string } body
  ["Assembly Accession"         , 'sequence_assemblies'],
  ["CheckM Histogramm"          , 'checkm_histogram']
]);

@Injectable({
  providedIn: 'root',
})
export class NCBIDataService {
  private http    = inject(HttpClient);
  private queries = signal<RegisteredQuery[]>([]);
  private results = signal<DataPacket[]>([]);

  registerQuery(q: QueryPacket): CallerID {
    const id: CallerID = uuidv4();
    this.queries.update(registered => [...registered, {caller: id, query: q}]);
    return id;
  }

  constructor(){
    effect(() => {
      if (this.queries().length > 0) {
        const newQuery = this.queries()!.pop()!;
        this.callGenomeAPI(newQuery);
      }
    });
  }

  callGenomeAPI(q: RegisteredQuery) {
    switch (q.query.get) {
      case "Annotation Report":           this.getGenomeAnnotationReport(q.query, q.caller); break;
/*
      case "Annotation Data Package":     this.getGenomeAnnotationDataPackage(); break;
      case "Annotation Download Summary": this.getGenomeAnnotationDownloadSummary(); break;
      case "Annotation Report Summary":   this.getGenomeAnnotationReportSummary(); break;
      case "Revision History":            this.getGenomeRevisionHistory(); break;
      case "Sequence Report":             this.getGenomeSequenceReport(); break;
      case "Assembly Report":             this.getGenomeAssemblyReport(); break;
      case "Data Package":                this.getGenomeDataPackage(); break;
      case "Download Summary":            this.getGenomeDownloadSummary(); break;
      case "Assembly Accession":          this.postGenomeAssemblyAccession(); break;
      case "CheckM Histogramm":           this.getGenomeCheckMHistogramm(); break;
*/
    }
  }

  createUrl(q: QueryPacket): string {
    return apiDatasetsV2
         + byExtension.get(q.by)
         + ((q.with) ? q.with + '/' : '')
         + getExtension.get(q.get)
  }

  getGenomeAnnotationReport(query: QueryPacket, id: CallerID) {
    const url = this.createUrl(query!);
    this.http.get<AnnotationReport>(url)
             .subscribe(res => {
               console.log(`Received an Annotation Report:\n${res}`);
               this.results.update(outgoing => [...outgoing, {
                 caller: id,
                 type: "Annotation Report",
                 data: [],
                 metadata: new Map<string, string>([
                   ["url", url],
                 ]),
               }]);
             });
  }


/*
  async getGenomeAnnotationDataPackage() {
    console.log("Annotation Data Package Retrieval is not yet implemented");
  }

  async getGenomeAnnotationDownloadSummary() {
    const q = this.query();
    this.http.get<AnnotationDownloadSummary>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Annotation Data Download Summary:\n${res}`);
             });
  }

  async getGenomeAnnotationReportSummary() {
    const q = this.query();
    this.http.get<AnnotationReportSummary>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Annotation Report Summary:\n${res}`);
             });
  }

  async getGenomeRevisionHistory() {
    const q = this.query();
    this.http.get<RevisionHistory>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Revision History:\n${res}`);
             });
  }

  async getGenomeSequenceReport() {
    const q = this.query();
    this.http.get<SequenceReports>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Sequence Report:\n${res}`);
             });
  }

  async getGenomeAssemblyReport() {
    const q = this.query();
    this.http.get<RevisionHistory>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Assembly Report:\n${res}`);
             });
  }

  async getGenomeDataPackage() {
    console.log("Data Package Retrieval is not yet implemented");
  }

  async getGenomeDownloadSummary() {
    const q = this.query();
    this.http.get<DownloadSummary>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received an Assembly Report:\n${res}`);
             });
  }

  async postGenomeAssemblyAccession() {
    const q = this.query();
    if (q?.param) {
      this.http.post<AssemblyAccession>(this.createUrl(q!), q.param)
               .subscribe(res => {
                 console.log(`Received an Assembly Accession:\n${res}`);
               });
    }
  }

  async getGenomeCheckMHistogramm() {
    const q = this.query();
    this.http.get<RevisionHistory>(this.createUrl(q!))
             .subscribe(res => {
               console.log(`Received a checkM histogram:\n${res}`);
             });
  }
*/

}

