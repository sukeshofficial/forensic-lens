export type CaseStatus = 'OPEN' | 'PAUSED' | 'CLOSED';

export interface InvestigationCase {
  id: string;
  caseId: string;
  name: string;
  description?: string;
  investigator?: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  evidenceCount: number;
  artifactCount: number;
  notes?: string;
}

export type AnalysisStatus = 'NOT_ANALYZED' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface EvidenceItem {
  id: string;
  caseId: string;
  filename: string;
  type: string;
  size: number;
  hash?: string;
  importedAt: string;
  source?: string;
  analysisStatus: AnalysisStatus;
  bookmarked: boolean;
}

export interface AuditLog {
  id: string;
  caseId?: string;
  action: string;
  description: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
}

export interface DomainEntityRelation {
  artifact?: string;
  sourceFile?: string;
  evidenceId: string;
  caseId: string;
}

/* Phase 2: Image Artifact & EXIF / GPS Domain Models */

export type ImageAnalysisStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface ImageExifMetadata {
  make?: string;
  model?: string;
  lensModel?: string;
  dateTimeOriginal?: string;
  exposureTime?: string;
  fNumber?: number;
  iso?: number;
  focalLength?: number;
  software?: string;
  orientation?: number;
}

export interface ImageGpsMetadata {
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

export interface ImageArtifact {
  id: string;
  evidenceId: string;
  caseId: string;

  filename: string;
  mimeType: string;
  fileSize: number;

  width?: number;
  height?: number;
  aspectRatio?: number;

  sha256?: string;
  md5?: string;

  thumbnail?: string;

  exif?: ImageExifMetadata;
  gps?: ImageGpsMetadata;

  createdAt: string;
  analyzedAt?: string;

  analysisStatus: ImageAnalysisStatus;
  bookmarked?: boolean;

  dhash?: string;
  analysisVersion?: string;
}

/* Phase 3: Advanced Image Forensics Domain Models */

export interface ImageDuplicateGroup {
  id: string;
  caseId: string;
  hash: string;
  imageArtifactIds: string[];
  detectedAt: string;
}

export interface ImageSimilarityResult {
  id: string;
  caseId: string;
  sourceImageId: string;
  targetImageId: string;
  algorithm: 'dHash' | 'pHash' | 'aHash';
  distance: number;
  similarity: number; // Percentage 0 - 100
  threshold: number;
  analyzedAt: string;
}

export interface ImageOcrResult {
  id: string;
  caseId: string;
  imageArtifactId: string;
  text: string;
  language?: string;
  confidence?: number;
  engine: string;
  analyzedAt: string;
}

export type ImageIndicatorSeverity = 'INFO' | 'NOTICE' | 'REVIEW' | 'FLAGGED';

export interface ImageForensicIndicator {
  id: string;
  caseId: string;
  imageArtifactId: string;
  severity: ImageIndicatorSeverity;
  code: string;
  title: string;
  description: string;
  evidence?: Record<string, unknown>;
  createdAt: string;
}
