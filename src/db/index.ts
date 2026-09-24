import Dexie, { type Table } from 'dexie';
import type {
  InvestigationCase,
  EvidenceItem,
  AuditLog,
  ImageArtifact,
  ImageDuplicateGroup,
  ImageSimilarityResult,
  ImageOcrResult,
  ImageForensicIndicator,
} from '../types';

export class ForensicLensDatabase extends Dexie {
  cases!: Table<InvestigationCase, string>;
  evidence!: Table<EvidenceItem, string>;
  auditLogs!: Table<AuditLog, string>;
  imageArtifacts!: Table<ImageArtifact, string>;
  imageDuplicateGroups!: Table<ImageDuplicateGroup, string>;
  imageSimilarityResults!: Table<ImageSimilarityResult, string>;
  imageOcrResults!: Table<ImageOcrResult, string>;
  imageIndicators!: Table<ImageForensicIndicator, string>;

  constructor() {
    super('ForensicLensDB');
    this.version(1).stores({
      cases: 'id, caseId, name, status, createdAt, updatedAt',
      evidence: 'id, caseId, filename, type, importedAt, analysisStatus, bookmarked',
      auditLogs: 'id, caseId, action, timestamp',
    });

    this.version(2).stores({
      cases: 'id, caseId, name, status, createdAt, updatedAt',
      evidence: 'id, caseId, filename, type, importedAt, analysisStatus, bookmarked',
      auditLogs: 'id, caseId, action, timestamp',
      imageArtifacts: 'id, evidenceId, caseId, filename, mimeType, sha256, createdAt, analysisStatus, bookmarked',
    });

    this.version(3).stores({
      cases: 'id, caseId, name, status, createdAt, updatedAt',
      evidence: 'id, caseId, filename, type, importedAt, analysisStatus, bookmarked',
      auditLogs: 'id, caseId, action, timestamp',
      imageArtifacts: 'id, evidenceId, caseId, filename, mimeType, sha256, dhash, createdAt, analysisStatus, bookmarked',
      imageDuplicateGroups: 'id, caseId, hash, detectedAt',
      imageSimilarityResults: 'id, caseId, sourceImageId, targetImageId, algorithm, similarity, analyzedAt',
      imageOcrResults: 'id, caseId, imageArtifactId, engine, analyzedAt',
      imageIndicators: 'id, caseId, imageArtifactId, severity, code, createdAt',
    });
  }
}

export const db = new ForensicLensDatabase();
