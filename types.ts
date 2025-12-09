export enum SleepStage {
  Awake = "Awake",
  REM = "REM",
  Light = "Light",
  Deep = "Deep"
}

export interface Disruption {
  time: string;
  cause: string;
  impact: string; // e.g., "Woke up", "Shifted to Light Sleep"
}

export interface TimelineEvent {
  time: string;
  stage: SleepStage;
  description?: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  timeline: TimelineEvent[];
  disruptions: Disruption[];
  recommendations: string[];
  environmentAnalysis: string; // Analysis of the bedroom image
}

export interface FileInput {
  file: File;
  previewUrl?: string;
  base64?: string;
  mimeType?: string;
}

export interface AppState {
  audioFile: FileInput | null;
  imageFile: FileInput | null;
  trackerText: string;
  userNotes: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}