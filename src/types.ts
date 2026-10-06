/** Raw XML fragments not mapped to typed fields (stable JSON-serializable shape). */
export type UnmappedNodes = Record<string, unknown>;

/** Parsed XML tree for lossless round-trip (internal document shape). */
export type XmlDocument = Record<string, unknown>;

export interface LattesDate {
  raw: string;
  iso?: string;
}

export interface LattesDateTime {
  rawDate: string;
  rawTime?: string;
  iso?: string;
}

export interface CurriculumMetadata {
  systemOrigin?: string;
  dateFormat?: string;
  timeFormat?: string;
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
  languageCode?: string;
  proficiency?: string;
  reading?: string;
  speaking?: string;
  writing?: string;
  comprehension?: string;
  raw?: Record<string, unknown>;
}

export interface AcademicDegree {
  xmlTag?: string;
  level: string;
  title?: string;
  institution?: string;
  startYear?: string;
  endYear?: string;
  status?: string;
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface EmploymentLink {
  linkType?: string;
  functionalRole?: string;
  weeklyHours?: string;
  exclusive?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  raw?: Record<string, unknown>;
}

export interface ProfessionalActivity {
  institution?: string;
  institutionCode?: string;
  role?: string;
  startYear?: string;
  endYear?: string;
  links: EmploymentLink[];
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
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface TechnicalItem {
  type: string;
  xmlTag?: string;
  containerTag?: string;
  title: string;
  year?: string;
  sequence?: string;
  authors?: Author[];
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
  promotingEntity?: string;
  raw?: Record<string, unknown>;
}

export interface ComplementaryTraining {
  type: string;
  title?: string;
  institution?: string;
  workload?: string;
  startYear?: string;
  endYear?: string;
  status?: string;
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface EventParticipation {
  type: string;
  title?: string;
  year?: string;
  eventName?: string;
  city?: string;
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface AdditionalInstitution {
  institutionCode: string;
  acronym?: string;
  country?: string;
  raw?: Record<string, unknown>;
}

export interface AdditionalCourse {
  courseCode: string;
  institutionCode?: string;
  institutionName?: string;
  raw?: Record<string, unknown>;
}

export interface ComplementaryData {
  complementaryTraining: ComplementaryTraining[];
  eventParticipation: EventParticipation[];
  additionalInstitutions: AdditionalInstitution[];
  additionalCourses: AdditionalCourse[];
  unmapped: UnmappedNodes;
}

export interface CurriculumIdentification {
  fullName: string;
  citationName?: string;
  summary?: string;
  summaryEnglish?: string;
  otherRelevantInfo?: string;
  professionalAddress?: ProfessionalAddress;
  residentialAddress?: ProfessionalAddress;
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
  /** Full CURRICULO-VITAE tree; required for serialize / round-trip. */
  document: XmlDocument;
  metadata: CurriculumMetadata;
  updatedAt: LattesDateTime;
  identification: CurriculumIdentification;
  academicBackground: AcademicDegree[];
  professionalActivities: ProfessionalActivity[];
  bibliographicProduction: BibliographicProduction;
  technicalProduction: TechnicalItem[];
  complementary: ComplementaryData;
  advisories: AdvisorySection;
  awards: Award[];
  unmapped: UnmappedNodes;
}
