export interface RedactionMethod {
  id: string;
  name: string;
  description: string;
}

export interface ProcessedFile {
  originalFile: File;
  processedBlob: Blob;
  redactionMethod?: string;
  detectedFaces?: number;
  warnings?: string[];
}

export interface AudioOptions {
  pitchShift: number;
  distortion: number;
  roboticFilter: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translation {
  [key: string]: string;
}

export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface FaceDetectionResult {
  faces: DetectedFace[];
  debugInfo: {
    modelUsed: string;
    processingTime: number;
    imageSize: { width: number; height: number };
    detectionCount: number;
  };
}