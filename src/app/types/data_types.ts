import { Avatar } from '../types/side_types';
import { Theme } from '../types/layout_types';
import { v4 as uuidv4 } from 'uuid';

export interface UserInfo {
  id: number,
  name: string,
  avatar: Avatar,
  theme: Theme,
  apiKey: string | null,
  lastSessionPath: string | null,
  createdAt: string,
  updatedAt: string,
}
export function defaultUserInfo(): UserInfo {
  const now = new Date();
  return {
    id: 0,
    name: "Test User",
    avatar: "Sheep",
    theme: "DarkLime",
    apiKey: null,
    lastSessionPath: null,
    createdAt: now.toISOString(),
    updatedAt: new Date(now).toISOString(),
  }
}
export const GENOME_QUERY_OPTS = [
    "Assembly Accession",
    "Nucleotide Accession",
    "Assembly Name",
    "BioProject Accession",
    "BioSample Accession",
    "Species Taxon",
    "WGS Accession"
] as const;
export type SelectectableQueryBy = typeof GENOME_QUERY_OPTS[number];

export const RETRIEVE_OPTS = [
    "Annotation Report",           // JSON Annotation Report
    "Annotation Data Package",     // Binary stream for .zip file
    "Annotation Download Summary", // JSON Preview of the annotation data package
    "Annotation Report Summary",   // JSON Preview of the Annotation Report
    "Revision History",            // JSON Summary of the Assembly Revision History
    "Sequence Report",             // JSON SequenceReports
    "Assembly Report",             // JSON AssemblyReports
    "Data Package",                // Binary stream for .zip file
    "Download Summary",            // JSON Preview of the data package
    "Assembly Accession",          // JSON assembly_accession
    "CheckM Histogramm"            // JSON for Histrogram data
];
export type SelectectableRetrieve = typeof RETRIEVE_OPTS[number];

interface RetrieveRosterItem {
    value: SelectectableRetrieve, compatibleWith: SelectectableQueryBy[]
}
export interface RetrieveRoster extends Array<RetrieveRosterItem>{}

export interface QueryPacket {
  get: SelectectableRetrieve,
  by:  SelectectableQueryBy,
  with: string,
  param?: QueryParameters
}

export interface RegisteredQuery {
  caller: CallerID,
  query: QueryPacket,
}

export interface DataPacket {
  caller: CallerID,
  type: SelectectableRetrieve,
  data: string[],
  metadata?: Map<string, string>
}


export type CallerID = string;


export type ReturnTypeNCBI = AnnotationReport
                           | AnnotationDownloadSummary
                           | AnnotationReportSummary
                           | RevisionHistory
                           | SequenceReports
                           | AssemblyReports
                           | DownloadSummary
                           | AssemblyAccession
                           | CheckMHistogram
                           | CustomMessage;

export interface CustomMessage {
  message: string,
  sender: string
}
export interface QueryParameters {
  annotation_ids?: string[],
  //Limit to one or more features annotated on the genome by specifying a number corresponding to rowID (unstable feature)
  symbols?: string[],
  //Limit to annotated features matching the gene symbol
  locations?: string[],
  //Limit to specific location: ${name/accession}:${start}-${stop} -> NZ_CM177092.1:1-10,000
  gene_types?: string[],
  //
  search_text?: string[],
  sort?: {
    field?: string,
    direction?: "SORT_DIRECTION_UNSPECIFIED" | "SORT_DIRECTION_ASCENDING" | "SORT_DIRECTION_DESCENDING",
  },
  page_size?: number,
  table_format?: "NO_TABLE" | "SUMMARY" | "PRODUCT",
  include_annotation_type?: "DEFAULT" | "GENOME_FASTA" | "RNA_FASTA" | "PROT_FASTA",
  include_tabular_header?: "INCLUDE_TABULAR_HEADER_FIRST_PAGE_ONLY" |
                           "INCLUDE_TABULAR_HEADER_ALWAYS" |
                           "INCLUDE_TABULAR_HEADER_NEVER",
  page_token?: string,
  filename?: string,
}

// === API Interface Objects ===

/* Return Object for "Annotation Report" Query */
export interface AnnotationReport {
  reports: DataReport[],
  messages: DataMessages[],
  total_count: number,
  next_page_token: string,
}

/* Return Object for "Annotation Download Summary" Query */
export interface AnnotationDownloadSummary {
  record_count: number,
  assembly_count: number,
  resource_updated_on: Date,
  hydrated: {
    estimated_file_size_mb: number,
    url: string,
    cli_download_command_line: string,
  }
  dehydrated: {
    estimated_file_size_mb: number,
    url: string,
    cli_download_command_line: string,
    cli_rehydrate_command_line: string,
  }
  errors: ErrorData[],
  messages: DataMessages[],
  available_files: {
    all_genomic_fasta:  FileInformation,
    genome_gff:         FileInformation,
    genome_gbff:        FileInformation,
    rna_fasta:          FileInformation,
    prot_fasta:         FileInformation,
    genome_gtf:         FileInformation,
    cds_fasta:          FileInformation,
    sequence_report:    FileInformation,
    annotation_report:  FileInformation,
  }
}

/* Return Object for "Annotation Report Summary" Query */
export interface AnnotationReportSummary {
  accession: string,
  chromosomes: string[],
  gene_types: string[],
  empty_columns: string[],
}

/* Return Object for "Revision History" Query */
export interface RevisionHistory {
  assembly_revisions: AssemblyRevision[],
  total_count: number,
}

/* Return Object for "Sequence Report" Query */
export interface SequenceReports {
  reports: SequenceReport[]
  total_count: number,
  next_page_token: string,
}

/* Return Object for "Assembly Report" Query */
export interface AssemblyReports {
  reports: AssemblyReport[],
  content_type: "COMPLETE" | "ASSM_ACC" | "PAIRED_ACC",
  total_count: number,
  next_page_token: string,
  messages: DataMessages[],
}

/* Return Object for "Download Summary" Query */
export interface DownloadSummary {
  record_count: number,
  assembly_count: number,
  resource_updated_on: Date,
  hydrated: {
    estimated_file_size_mb: number,
    url: string,
    cli_download_command_line: string,
  },
  dehydrated: {
    estimated_file_size_mb: number,
    url: string,
    cli_download_command_line: string,
    cli_rehydrate_command_line: string,
  },
  errors: ErrorData[],
  messages: DataMessages[],
  available_files: {
    all_genomic_fasta:  FileInformation,
    genome_gff:         FileInformation,
    genome_gbff:        FileInformation,
    rna_fasta:          FileInformation,
    prot_fasta:         FileInformation,
    genome_gtf:         FileInformation,
    cds_fasta:          FileInformation,
    sequence_report:    FileInformation,
    annotation_report:  FileInformation,
  }
}

/* Return Object for "AssemblyAccession" Query */
export interface AssemblyAccession {
  accession: string[],
}

/* Return Object for "AssemblyAccession" Query */
export interface CheckMHistogram {
  species_taxid: number,
  histogram_intervals: {
    start_pos: number,
    stop_pos: number,
    count: number,
  }[],
}
//TODO: Implement interface for CheckM Histogramm

interface AssemblyReport {
  accession: string,
  current_accession: string,
  paired_accession: string,
  source_database: "SOURCE_DATABASE_UNSPECIFIED"
                 | "SOURCE_DATABASE_GENBANK"
                 | "SOURCE_DATABASE_REFSEQ",
  organism: OrganismInformation,
  assembly_info: AssemblyInformation,
  assembly_stats: AssemblyStats,
  organelle_info: OrganelleInformation[],
  additional_submitters: Submitter[],
  annotation_info: AnnotationInformation,
  wgs_info: {
    wgs_project_accession: string,
    master_wgs_url: string,
    wgs_contigs_url: string,
  },
  type_material: {
    type_label: string,
    type_display_text: string,
  },
  checkm_info: CheckMInformation,
  average_nucleotide_identity: ANI,
}

type ANI_Category = "ANI_CATEGORY_UNKNOWN"
                  | "claderef"
                  | "category_na"
                  | "neotype"
                  | "no_type"
                  | "pathovar"
                  | "reftype"
                  | "suspected_type"
                  | "synonym"
                  | "type";


interface ANI {
  taxonomy_check_status: "TAXONOMY_CHECK_STATUS_UNKNOWN"
                       | "OK"
                       | "Failed"
                       | "Inconclusive"
  match_status: "BEST_MATCH_STATUS_UNKNOWN"
              | "approved_mismatch"
              | "below_threshold_match"
              | "below_threshold_mismatch"
              | "best_match_status"
              | "derived_species_match"
              | "genus_match"
              | "low_coverage"
              | "mismatch"
              | "status_na"
              | "species_match"
              | "subspecies_match"
              | "synonym_match"
              | "lineage_match"
              | "below_threshold_lineage_match",
  submitted_organism: string,
  submitted_species: string
  category: ANI_Category,
  submitted_ani_match: AniMatch,
  best_ani_match: AniMatch,
  comment: string
}

interface AniMatch {
  assembly: string
  organism_name: string
  category: ANI_Category,
  ani: number
  assembly_coverage: number
  type_assembly_coverage: number
}

interface AnnotationInformation {
  name: string,
  provider: string,
  release_date: string,
  report_url: string,
  stats: {
    gene_counts: {
      total: number,
      protein_coding: number,
      non_coding: number,
      pseudogene: number,
      other: number,
    }
  },
  busco: BuscoInformation,
  method: string,
  pipeline: string,
  software_version: string,
  status: string,
  release_version: string,
}

interface CheckMInformation {
  checkm_marker_set: string,
  checkm_species_tax_id: number,
  checkm_marker_set_rank: string,
  checkm_version: string,
  completeness: number,
  contamination: number,
  completeness_percentile: number,
}

interface BuscoInformation {
  busco_lineage: string,
  busco_ver: string,
  complete: number,
  single_copy: number,
  duplicated: number,
  fragmented: number,
  missing: number,
  total_count: number,
}

interface OrganelleInformation {
  assembly_name: string,
  infraspecific_name: string,
  bioproject: string[],
  description: string
  total_seq_length: number,
  submitter: string,
}

interface Submitter {
  genbank_accession: string,
  refseq_accession: string,
  chr_name: string,
  molecule_type: string,
  submitter: string,
  bioproject_accession: string,
}

interface AssemblyStats {
  total_number_of_chromosomes: number,
  total_sequence_length: number,
  total_ungapped_length: number,
  number_of_contigs: number,
  contig_n50: number,
  contig_l50: number,
  number_of_scaffolds: number,
  scaffold_n50: number,
  scaffold_l50: number,
  gaps_between_scaffolds_count: number,
  number_of_component_sequences: number,
  atgc_count: number,
  gc_count: number,
  gc_percent: number,
  genome_coverage: string,
  number_of_organelles: number,
}

interface OrganismInformation {
  tax_id: number,
  sci_name: string,
  organism_name: string,
  common_name: string,
  lineage: {
    tax_id: number,
    name: string }[],
  strain: string,
  pangolin_classification: string,
  infraspecific_names: {
    breed: string,
    cultivar: string,
    ecotype: string,
    isolate: string,
    sex: string,
    strain: string,
  }
}

interface AssemblyInformation {
  assembly_level: string,
  assembly_status: "ASSEMBLY_STATUS_UNKNOWN"
                 | "current"
                 | "previous"
                 | "suppressed"
                 | "retired",
  paired_assembly: {
    accession: string,
    status: "ASSEMBLY_STATUS_UNKNOWN"
          | "current"
          | "previous"
          | "suppressed"
          | "retired",
    annotation_name: string,
    only_genbank: string,
    only_refseq: string,
    changed: string,
    manual_diff: string,
    refseq_genbank_are_different: boolean,
    differences: string,
  },
  assembly_name: string,
  assembly_long_name: string,
  assembly_type: string,
  bioproject_lineage: {
    bioprojects: BioProject[],
  }[],
  bioproject_accession: string,
  submission_date: string,
  release_date: string,
  description: string,
  submitter: string,
  refseq_category: string,
  synonym: string,
  linked_assembly: string,
  linked_assemblies: {
    linked_assembly: string,
    assembly_type: AssemblyType,
  }[],
  atypical: {
    is_atypical: boolean,
    warnings: string[],
  },
  genome_notes: string[],
  sequencing_tech: string,
  assembly_method: string,
  grouping_method: string,
  biosample: {

  },
  blast_url: string,
  comments: string,
  suppression_reason: string,
  diploid_role: AssemblyType
}

type AssemblyType = "LINKED_ASSEMBLY_TYPE_UNKNOWN"
                  | "alternate_pseudohaplotype_of_diploid"
                  | "principal_pseudohaplotype_of_diploid"
                  | "maternal_haplotype_of_diploid"
                  | "paternal_haplotype_of_diploid"
                  | "haplotype_1"
                  | "haplotype_2"
                  | "haplotype_3"
                  | "haplotype_4"
                  | "haploid";

interface BioSampleEntry {
  accession: string,
  last_updated: string,
  publication_date: string,
  submission_date: string,
  sample_ids: {
    db: string,
    label: string,
    value: string,
  }[],
  description: {
    title: string,
    organism: OrganismInformation,
    comment: string,
  },
  owner: {
    name: string,
    contacts: {
      lab: string,
    }[],
  },
  models: string[]
  bioprojects: BioProject[],
  package: string,
  attributes: {name: string, value: string}[],
  status: {status: string, when: string},
  age: string,
  biomaterial_provider: string,
  breed: string,
  collected_by: string,
  collection_date: string,
  cultivar: string,
  dev_stage: string,
  ecotype: string,
  geo_loc_name: string,
  host: string,
  host_disease: string,
  identified_by: string,
  ifsac_category: string,
  isolate: string,
  isolate_name_alias: string,
  isolation_source: string,
  lat_lon: string,
  project_name: string,
  sample_name: string,
  serovar: string,
  sex: string,
  source_type: string,
  strain: string,
  sub_species: string,
  tissue: string,
  serotype: string,
}

interface SequenceReport {
  assembly_accession: string,
  chr_name: string,
  ucsc_style_name: string,
  sort_order: number,
  assigned_molecule_location_type: string,
  refseq_accession: string,
  assembly_unit: string,
  length: number,
  genbank_accession: string,
  gc_count: number,
  gc_percent: number,
  unlocalized_count: number,
  assembly_unplaced_count: number,
  role: string,
  sequence_name: string,
}

interface BioProject {
  accession:string,
  title: string,
  parent_accession: string,
  parent_accessions: string[],
}

interface AssemblyRevision {
  genbank_accession: string,
  refseq_accession: string,
  assembly_name: string,
  assembly_level: "chromosome" | "scaffold" | "contig" | "complete_genome",
  release_date: string,
  submission_date: string,
  sequencing_technology: string,
  identical: boolean, // are genbank and refseq revision identical
}

interface FileInformation {
  file_count: number,
  size_mb: number
}

interface DataReport {
  annotation: AnnotationData,
  query: string[],
  warning: WarningData,
  errors: ErrorData[],
  row_id: string    // @ncbi: Why is this a string?
}

interface WarningData {
  gene_warning_code: "UNKNOWN_GENE_WARNING_CODE"
                   | "ACCESSION_VERSION_MISMATCH"
                   | "REPLACED_GENE_ID"
                   | "DISCONTINUED_GENE_ID"
                   | "UNRECOGNIZED_GENE_ID"
                   | "UNRECOGNIZED_GENE_SYMBOL"
                   | "UNRECOGNIZED_ACCESSION"
                   | "UNRECOGNIZED_TAX_TOKEN"
                   | "NO_GENE_ANNOTATION_FOUND"
                   | "ABOVE_SPECIES_TAXON",
  reason: string,
  message: string,
  replaced_id: {
    requested: string,
    returned: string,
  },
  unrecognized_identifier: string
}

interface ErrorData {
  assembly_error_code:  ErrorCodeAssembly,
  gene_error_code:      ErrorCodeGene,
  organelle_error_code: ErrorCodeOrganelle,
  virus_error_code:     ErrorCodeVirus,
  taxonomy_error_code:  ErrorCodeTaxonomy,
  sequence_error_code:  ErrorCodeSequence,
  reason: string,
  message: string,
  invalid_identifierts: string[],
}

type ErrorCodeAssembly = "UNKNOWN_ASSEMBLY_ERROR_CODE"
                       | "INVALID_BIOPROJECT_IDS"
                       | "NO_ASSEMBLIES_FOR_BIOPROJECTS"
                       | "INVALID_TAXON"
                       | "MISSING_SEARCH_FIELD"
                       | "INVALID_BIOSAMPLE_IDS"
                       | "NO_ASSEMBLIES_FOR_BIOSAMPLE_IDS"
                       | "NO_ASSEMBLIES_FOR_ASSEMBLY_NAMES"
                       | "INVALID_WGS_ACCESSIONS"
                       | "NO_ASSEMBLIES_FOR_WGS_ACCESSIONS";
type ErrorCodeGene = "UNKNOWN_GENE_ERROR_CODE"
                   | "INCOMPLETE_LOOKUP_SYMBOL"
                   | "INVALID_TAXON_GENE_ARGUMENT";
type ErrorCodeOrganelle = "UNKNOWN_ORGANELLE_ERROR_CODE"
                        | "INVALID_ORGANELLE_TAXON"
                        | "NO_ORGANELLES_FOR_ACCESSION";
type ErrorCodeVirus    = "UNKOWN_VIRUS_ERROR_CODE";
type ErrorCodeTaxonomy = "UNKNOWN_TAXONOMY_ERROR_CODE" | "INVALID_TAXONOMY_TAXON";
type ErrorCodeSequence = "UNKNOWN_SEQUENCE_ERROR_CODE" | "INVALID_SEQUENCE_ACCESSION";


interface DataMessages {
  error: ErrorData,
  warning: WarningData,
}

interface AnnotationData {
  gene_id: number,  // uint64
  symbol: string,
  description: string,
  name: string,
  tax_id: number,   // uint64
  taxname: string,
  common_name: string,
  type: string      // gene_type
  rna_type: string,
  orientation: "none" | "plus" | "minus",
  locus_tag: string,
  reference_standards: GenomicRegionData[],
  genomic_regions: GenomicRegionData[],
  transcripts: TranscriptData[],
  proteins: ProteinData[]
  chromosomes: string[],
  swiss_prot_accessions: string[],
  ensembl_gene_ids: string[],
  omim_ids: string[],
  synonyms: string[],
  annotations: Annotation[],
}

interface GenomicRegionData {
  gene_range: GeneRange,
  type: "UNKNOWN" | "REFSEQ_GENE" | "PSEUDOGENE" | "BIOLOGICAL_REGION" | "OTHER";
}

interface TranscriptData extends CoreDescriptor{
  cds: GeneRange,
}

interface GeneRange {
  accession_version: string,
  range: SequenceRange[],
}

interface SequenceRange {
  begin: number,
  end: number,
  orientation: "none" | "plus" | "minus",
  order: number, // position in a group of sequences
  ribosomal_slippage: number,
}

interface CoreDescriptor {
  accession_version: string,
  name: string,
  length: number,
}

interface ProteinData extends CoreDescriptor {
  isoform_name: string,
  ensembl_protein: string,
  mature_peptides: CoreDescriptor[],
}

interface Annotation {
  assembly_accession: string,
  assembly_name: string,
  annotation_name: string,
  annotation_release_date: string,
  genomic_locations: GenomicLocation[],
}

interface GenomicLocation {
  genomic_accession_version: string,
  sequence_name: string,
  genomic_range: SequenceRange[],
  exons: SequenceRange[],
}

