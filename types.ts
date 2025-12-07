export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum TargetAI {
  CHATGPT = 'ChatGPT',
  CLAUDE = 'Claude',
  GEMINI = 'Gemini',
  OTHER = 'Other'
}

export enum OptimizationMode {
  BASIC = 'BASIC',
  DETAIL = 'DETAIL'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  isStreaming?: boolean;
}

export interface AppSettings {
  targetAI: TargetAI;
  mode: OptimizationMode;
}