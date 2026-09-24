import { ImageIndicatorRepository } from './advancedImageRepositories';
import { AuditLogRepository } from './repositories';
import type { ImageArtifact, ImageForensicIndicator } from '../types';

export const ImageIndicatorService = {
  /**
   * Generates neutral, evidence-based forensic indicators for an image artifact.
   */
  async generateIndicators(artifact: ImageArtifact): Promise<ImageForensicIndicator[]> {
    const indicators: ImageForensicIndicator[] = [];
    const timestamp = new Date().toISOString();

    // 1. EXIF Presence Indicator (INFO)
    if (artifact.exif) {
      indicators.push({
        id: `ind-${Date.now()}-exif`,
        caseId: artifact.caseId,
        imageArtifactId: artifact.id,
        severity: 'INFO',
        code: 'EXIF_METADATA_DETECTED',
        title: 'EXIF Metadata Present',
        description: 'Camera EXIF metadata structures detected in image header.',
        evidence: { exif: artifact.exif },
        createdAt: timestamp,
      });
    } else {
      indicators.push({
        id: `ind-${Date.now()}-no-exif`,
        caseId: artifact.caseId,
        imageArtifactId: artifact.id,
        severity: 'NOTICE',
        code: 'NO_EXIF_METADATA',
        title: 'EXIF Metadata Unavailable',
        description: 'No EXIF metadata structure was found in the image header.',
        createdAt: timestamp,
      });
    }

    // 2. GPS Location Indicator (INFO)
    if (artifact.gps) {
      indicators.push({
        id: `ind-${Date.now()}-gps`,
        caseId: artifact.caseId,
        imageArtifactId: artifact.id,
        severity: 'INFO',
        code: 'GPS_LOCATION_DETECTED',
        title: 'GPS Geolocation Metadata Present',
        description: `Geolocation coordinates recorded (Lat: ${artifact.gps.latitude}, Long: ${artifact.gps.longitude}).`,
        evidence: { gps: artifact.gps },
        createdAt: timestamp,
      });
    } else {
      indicators.push({
        id: `ind-${Date.now()}-no-gps`,
        caseId: artifact.caseId,
        imageArtifactId: artifact.id,
        severity: 'NOTICE',
        code: 'NO_GPS_METADATA',
        title: 'GPS Metadata Unavailable',
        description: 'No GPS geolocation metadata recorded for this image.',
        createdAt: timestamp,
      });
    }

    // 3. Editing Software Detection (REVIEW)
    if (artifact.exif?.software) {
      const sw = artifact.exif.software.toLowerCase();
      const editingKeywords = ['photoshop', 'gimp', 'lightroom', 'paint', 'snapseed', 'canva', 'affinity'];
      const isEditingTool = editingKeywords.some((k) => sw.includes(k));

      if (isEditingTool) {
        indicators.push({
          id: `ind-${Date.now()}-software`,
          caseId: artifact.caseId,
          imageArtifactId: artifact.id,
          severity: 'REVIEW',
          code: 'EDITING_SOFTWARE_DETECTED',
          title: 'Editing Software Metadata Recorded',
          description: `EXIF metadata lists processing software: "${artifact.exif.software}".`,
          evidence: { software: artifact.exif.software },
          createdAt: timestamp,
        });
      }
    }

    // 4. Timestamp Discrepancy Observation (REVIEW)
    if (artifact.exif?.dateTimeOriginal) {
      const exifTime = new Date(artifact.exif.dateTimeOriginal).getTime();
      const importTime = new Date(artifact.createdAt).getTime();

      // If imported file date is significantly different from EXIF Date Taken (> 24 hours)
      if (Math.abs(importTime - exifTime) > 86400000) {
        indicators.push({
          id: `ind-${Date.now()}-timestamp`,
          caseId: artifact.caseId,
          imageArtifactId: artifact.id,
          severity: 'REVIEW',
          code: 'TIMESTAMP_DISCREPANCY',
          title: 'Metadata Timestamp Discrepancy',
          description: 'EXIF DateTimeOriginal differs significantly from file system import timestamp.',
          evidence: {
            dateTimeOriginal: artifact.exif.dateTimeOriginal,
            importTimestamp: artifact.createdAt,
          },
          createdAt: timestamp,
        });
      }
    }

    // Save indicators to DB
    await ImageIndicatorRepository.saveIndicators(artifact.id, indicators);

    // Audit log
    for (const ind of indicators) {
      await AuditLogRepository.log({
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        caseId: artifact.caseId,
        action: 'IMAGE_INDICATOR_CREATED',
        description: `Forensic observation [${ind.severity}]: ${ind.title} (${ind.code}) created for image ${artifact.filename}.`,
        entityType: 'IMAGE_FORENSIC_INDICATOR',
        entityId: ind.id,
        timestamp,
      });
    }

    return indicators;
  },
};
