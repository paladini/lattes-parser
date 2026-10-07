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

export interface AddressContact {
  preference?: string;
  electronic?: string;
  otherContact?: string;
  socialNetwork?: string;
}

export interface ProfessionalAddress {
  institution?: string;
  department?: string;
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  postalCode?: string;
  neighborhood?: string;
  areaCode?: string;
  phone?: string;
  email?: string;
  homepage?: string;
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

export interface ResearchProjectTeamMember {
  name: string;
  citationName?: string;
  integrationOrder?: string;
  responsible?: string;
  raw?: Record<string, unknown>;
}

export interface ResearchProjectFunder {
  sequence?: string;
  institutionCode?: string;
  institutionName?: string;
  nature?: string;
  raw?: Record<string, unknown>;
}

export interface ResearchProject {
  name: string;
  nameEnglish?: string;
  startYear?: string;
  endYear?: string;
  sequence?: string;
  situation?: string;
  nature?: string;
  description?: string;
  descriptionEnglish?: string;
  projectIdentifier?: string;
  innovationPotential?: string;
  teamMembers: ResearchProjectTeamMember[];
  funders: ResearchProjectFunder[];
  raw?: Record<string, unknown>;
}

export interface ProjectParticipation {
  sequence?: string;
  periodFlag?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  organCode?: string;
  organName?: string;
  unitCode?: string;
  unitName?: string;
  projects: ResearchProject[];
  raw?: Record<string, unknown>;
}

export interface ProfessionalActivity {
  institution?: string;
  institutionCode?: string;
  role?: string;
  startYear?: string;
  endYear?: string;
  links: EmploymentLink[];
  projectParticipations: ProjectParticipation[];
  raw?: Record<string, unknown>;
}

export interface Author {
  name: string;
  citationName?: string;
  order?: number;
  raw?: Record<string, unknown>;
}

export interface BibliographicItem extends ProductionEnvelope {
  type: string;
  xmlTag?: string;
  title: string;
  year?: string;
  authors: Author[];
  journalOrEvent?: string;
  doi?: string;
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface KnowledgeAreaEntry {
  majorArea?: string;
  area?: string;
  subArea?: string;
  specialty?: string;
}

export interface ProductionAdditionalInfo {
  description?: string;
  descriptionEnglish?: string;
}

/** Attribute envelope shared by technical production items (XSD sequence). */
export interface ProductionEnvelope {
  basics: Record<string, string>;
  detail: Record<string, string>;
  keywords: string[];
  knowledgeAreas: KnowledgeAreaEntry[];
  activitySectors: string[];
  additionalInfo?: ProductionAdditionalInfo;
}

export interface ArtisticItem extends ProductionEnvelope {
  type: string;
  xmlTag: string;
  containerTag?: string;
  title: string;
  year?: string;
  sequence?: string;
  authors?: Author[];
  raw?: Record<string, unknown>;
}

export interface TechnicalItem extends ProductionEnvelope {
  type: string;
  xmlTag?: string;
  containerTag?: string;
  title: string;
  year?: string;
  sequence?: string;
  authors?: Author[];
  raw?: Record<string, unknown>;
}

export interface Advisory extends ProductionEnvelope {
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
  level?: string;
  institutionCode?: string;
  organCode?: string;
  organName?: string;
  courseCode?: string;
  titleEnglish?: string;
  sequence?: string;
  raw?: Record<string, unknown>;
}

export interface EventParticipant {
  name: string;
  citationName?: string;
  order?: number;
}

export interface EventParticipation extends ProductionEnvelope {
  type: string;
  title?: string;
  year?: string;
  eventName?: string;
  city?: string;
  sequence?: string;
  participants: EventParticipant[];
  raw?: Record<string, unknown>;
}

export interface BoardParticipant {
  name: string;
  citationName?: string;
  order?: number;
  raw?: Record<string, unknown>;
}

export interface BoardParticipation extends ProductionEnvelope {
  kind: "thesis" | "judging";
  xmlTag: string;
  title?: string;
  year?: string;
  sequence?: string;
  candidateName?: string;
  institution?: string;
  participants: BoardParticipant[];
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
  boards: BoardParticipation[];
  additionalInstitutions: AdditionalInstitution[];
  additionalCourses: AdditionalCourse[];
  unmapped: UnmappedNodes;
}

export interface License {
  type?: string;
  startDateFormat?: string;
  startDate?: string;
  endDateFormat?: string;
  endDate?: string;
  raw?: Record<string, unknown>;
}

export interface CurriculumIdentification {
  fullName: string;
  citationName?: string;
  summary?: string;
  summaryEnglish?: string;
  otherRelevantInfo?: string;
  addressContact?: AddressContact;
  professionalAddress?: ProfessionalAddress;
  residentialAddress?: ProfessionalAddress;
  researchAreas: ResearchArea[];
  languages: LanguageEntry[];
  /** Maternity and other leaves from `LICENCAS`. Personal identifiers stay untyped. */
  licenses: License[];
  unmapped: UnmappedNodes;
}

export interface BibliographicProduction {
  journalArticles: BibliographicItem[];
  /** `ARTIGOS-ACEITOS-PARA-PUBLICACAO`, kept apart from published articles. */
  acceptedArticles: BibliographicItem[];
  /** `TEXTOS-EM-JORNAIS-OU-REVISTAS`. */
  newspaperTexts: BibliographicItem[];
  conferencePapers: BibliographicItem[];
  booksAndChapters: BibliographicItem[];
  /** Includes scores, prefaces, and translations, distinguished by `xmlTag`. */
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
  /** `OUTRA-PRODUCAO` artistic and cultural items. Completed advisories stay on `document`. */
  artisticProduction: ArtisticItem[];
  complementary: ComplementaryData;
  advisories: AdvisorySection;
  awards: Award[];
  unmapped: UnmappedNodes;
}
