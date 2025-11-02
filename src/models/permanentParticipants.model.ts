export interface WinHistoryEntry {
  timestamp: number; // Unix timestamp
  date: string; // Человекочитаемая дата
}

export interface PermanentParticipant {
  id: string;
  name: string;
  amount?: number;
  color?: string;
  image?: string; // URL или base64 картинки для сектора
  enabled: boolean; // Включен ли участник для текущего прокрута
  winHistory?: WinHistoryEntry[]; // История выпадений
}

export interface ParticipantStatistics {
  totalWins: number; // Общее количество выпадений
  lastWinDate?: string; // Дата последнего выпадения
  winDates: string[]; // Даты всех выпадений
}

export interface PermanentParticipantsConfig {
  participants: PermanentParticipant[];
  version: string; // Версия конфига для совместимости
}

export interface ParticipantsPreset {
  id: string;
  name: string;
  participants: PermanentParticipant[];
  createdAt: number;
  updatedAt: number;
}

export interface PresetsConfig {
  presets: ParticipantsPreset[];
  activePresetId: string | null;
  version: string;
}
