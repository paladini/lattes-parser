/** Raw XML fragments not mapped to typed fields (stable JSON-serializable shape). */
export type UnmappedNodes = Record<string, unknown>;

export interface LattesDate {
  raw: string;
  iso?: string;
}

export interface LattesDateTime {
  rawDate: string;
  rawTime?: string;
  iso?: string;
}

export interface ProfessionalAddress {
  institution?: string;
  department?: string;
  city?: string;
  state?: string;
  country?: string;
  raw?: Record<string, unknown>;
}

export interface ResearchArea {
  name: string;
  knowledgeArea?: string;
  subArea?: string;
  specialty?: string;
  raw?: Record<string, unknown>;
}

export interface LanguageEntry {
  language: string;
  proficiency?: string;
  raw?: Record<string, unknown>;
}

export interface AcademicDegree {
  level: string;
  title?: string;
  institution?: string;
  startYear?: string;
  endYear?: string;
  status?: string;
  raw?: Record<string, unknown>;
}

export interface ProfessionalActivity {
  institution?: string;
  role?: string;
  startYear?: string;
  endYear?: string;
  raw?: Record<string, unknown>;
}

export interface Author {
  name: string;
  citationName?: string;
  order?: number;
  raw?: Record<string, unknown>;
}

export interface BibliographicItem {
  type: string;
  title: string;
  year?: string;
  authors: Author[];
  journalOrEvent?: string;
  doi?: string;
  raw?: Record<string, unknown>;
}

export interface TechnicalItem {
  type: string;
  title: string;
  year?: string;
  raw?: Record<string, unknown>;
}

export interface Advisory {
  type: string;
  studentName?: string;
  title?: string;
  institution?: string;
  year?: string;
  status: "completed" | "in_progress";
  raw?: Record<string, unknown>;
}

export interface Award {
  title: string;
  year?: string;
  raw?: Record<string, unknown>;
}

export interface CurriculumIdentification {
  fullName: string;
  citationName?: string;
  summary?: string;
  otherRelevantInfo?: string;
  professionalAddress?: ProfessionalAddress;
  researchAreas: ResearchArea[];
  languages: LanguageEntry[];
  unmapped: UnmappedNodes;
}

export interface BibliographicProduction {
  journalArticles: BibliographicItem[];
  conferencePapers: BibliographicItem[];
  booksAndChapters: BibliographicItem[];
  other: BibliographicItem[];
  unmapped: UnmappedNodes;
}

export interface AdvisorySection {
  completed: Advisory[];
  inProgress: Advisory[];
  unmapped: UnmappedNodes;
}

export interface Curriculum {
  id: string;
  updatedAt: LattesDateTime;
  identification: CurriculumIdentification;
  academicBackground: AcademicDegree[];
  professionalActivities: ProfessionalActivity[];
  bibliographicProduction: BibliographicProduction;
  technicalProduction: TechnicalItem[];
  advisories: AdvisorySection;
  awards: Award[];
  unmapped: UnmappedNodes;
}
