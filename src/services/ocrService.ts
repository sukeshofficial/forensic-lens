import { createWorker } from 'tesseract.js';
import { ImageOcrRepository } from './advancedImageRepositories';
import { AuditLogRepository } from './repositories';
import type { ImageOcrResult } from '../types';

export const OcrService = {
  /**
   * Runs local Tesseract OCR on image data URL.
   */
  async runOcr(
    imageId: string,
    caseId: string,
    imageDataUrl: string
  ): Promise<ImageOcrResult> {
    const timestamp = new Date().toISOString();

    await AuditLogRepository.log({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      caseId,
      action: 'IMAGE_OCR_STARTED',
      description: `Started local Tesseract.js OCR text extraction for image ${imageId}.`,
      entityType: 'IMAGE_ARTIFACT',
      entityId: imageId,
      timestamp,
    });

    const worker = await createWorker('eng');
    try {
      const ret = await worker.recognize(imageDataUrl);
      const text = ret.data.text.trim();
      const confidence = Math.round(ret.data.confidence);

      await worker.terminate();

      const result: ImageOcrResult = {
        id: `ocr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        caseId,
        imageArtifactId: imageId,
        text,
        confidence,
        engine: 'Tesseract.js (Local Browser)',
        analyzedAt: new Date().toISOString(),
      };

      await ImageOcrRepository.saveResult(result);

      await AuditLogRepository.log({
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        caseId,
        action: 'IMAGE_OCR_COMPLETED',
        description: `Completed OCR text extraction for image ${imageId}. Extracted ${text.length} characters (Confidence: ${confidence}%).`,
        entityType: 'IMAGE_OCR_RESULT',
        entityId: result.id,
        timestamp: result.analyzedAt,
      });

      return result;
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  },
};
