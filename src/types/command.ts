export interface SlashCommand {
  commandId: string;
  userId: string; // 'system' or user uid
  name: string; // e.g., "/study-feynman"
  category: string; // e.g., "study"
  description: string;
  role: string;
  objective: string;
  context?: string;
  instructions: string;
  outputFormat: string;
  qualityControl?: string;
  parameters?: string; // JSON string or description of variables like [TOPIK], [LEVEL]
  examples?: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isFavorite?: boolean;
  tags?: string[];
}

export interface CommandCategory {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface CommandGenerationInput {
  name: string;
  category: string;
  targetUser: string;
  objective: string;
  tone: string;
  detailLevel: string;
  outputFormat: string;
  additionalInstructions: string;
  role?: string;
  context?: string;
  qualityControl?: string;
}

export interface AiPromptInput {
  promptText: string;
  level: SkillLevel;
  categoryPreference?: string;
}

export type ActiveTab = 'home' | 'explore' | 'generate' | 'favorites' | 'profile';
