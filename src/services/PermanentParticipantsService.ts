import { v4 as uuidv4 } from 'uuid';

import {
  PermanentParticipant,
  PermanentParticipantsConfig,
  ParticipantStatistics,
  WinHistoryEntry,
  ParticipantsPreset,
  PresetsConfig,
} from '@models/permanentParticipants.model';
import { WheelItem } from '@models/wheel.model';
import { DEFAULT_PERMANENT_PARTICIPANTS_CONFIG } from '@constants/defaultPermanentParticipants';

const STORAGE_KEY = 'permanent_participants';
const PRESETS_STORAGE_KEY = 'participants_presets';
const CONFIG_VERSION = '1.0';

// Функция для генерации UUID с fallback
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return uuidv4();
};

class PermanentParticipantsService {
  /**
   * Получить всех постоянных участников из localStorage
   * Если данных нет, возвращает дефолтный конфиг
   */
  getParticipants(): PermanentParticipant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Возвращаем дефолтный конфиг для новых пользователей
        return DEFAULT_PERMANENT_PARTICIPANTS_CONFIG.participants;
      }

      const config: PermanentParticipantsConfig = JSON.parse(data);
      return config.participants || [];
    } catch (error) {
      console.error('Ошибка при загрузке постоянных участников:', error);
      return DEFAULT_PERMANENT_PARTICIPANTS_CONFIG.participants;
    }
  }

  /**
   * Сохранить список участников в localStorage
   */
  saveParticipants(participants: PermanentParticipant[]): void {
    try {
      const config: PermanentParticipantsConfig = {
        participants,
        version: CONFIG_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Ошибка при сохранении постоянных участников:', error);
    }
  }

  /**
   * Добавить нового участника
   */
  addParticipant(participant: Omit<PermanentParticipant, 'id' | 'enabled'>): PermanentParticipant {
    const participants = this.getParticipants();
    const newParticipant: PermanentParticipant = {
      ...participant,
      id: generateId(),
      enabled: true,
      color: participant.color || this.generateRandomColor(),
    };

    participants.push(newParticipant);
    this.saveParticipants(participants);

    return newParticipant;
  }

  /**
   * Удалить участника по ID
   */
  removeParticipant(id: string): void {
    const participants = this.getParticipants();
    const filtered = participants.filter((p) => p.id !== id);
    this.saveParticipants(filtered);
  }

  /**
   * Обновить участника
   */
  updateParticipant(id: string, updates: Partial<PermanentParticipant>): void {
    const participants = this.getParticipants();
    const index = participants.findIndex((p) => p.id === id);

    if (index !== -1) {
      participants[index] = { ...participants[index], ...updates };
      this.saveParticipants(participants);
    }
  }

  /**
   * Переключить состояние enabled для участника
   */
  toggleParticipant(id: string): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === id);

    if (participant) {
      participant.enabled = !participant.enabled;
      this.saveParticipants(participants);
    }
  }

  /**
   * Получить только включенных участников
   */
  getEnabledParticipants(): PermanentParticipant[] {
    return this.getParticipants().filter((p) => p.enabled);
  }

  /**
   * Конвертировать постоянных участников в WheelItem
   */
  toWheelItems(participants?: PermanentParticipant[]): WheelItem[] {
    const items = participants || this.getEnabledParticipants();

    return items.map((p) => ({
      id: p.id,
      name: p.name,
      amount: p.amount || 1,
      color: p.color || this.generateRandomColor(),
      image: p.image,
    }));
  }

  /**
   * Экспортировать конфиг в JSON строку
   */
  exportConfig(): string {
    const participants = this.getParticipants();
    const config: PermanentParticipantsConfig = {
      participants,
      version: CONFIG_VERSION,
    };

    return JSON.stringify(config, null, 2);
  }

  /**
   * Импортировать конфиг из JSON строки
   */
  importConfig(configJson: string, merge: boolean = false): boolean {
    try {
      const config: PermanentParticipantsConfig = JSON.parse(configJson);

      if (!config.participants || !Array.isArray(config.participants)) {
        throw new Error('Неверный формат конфига');
      }

      let participants = config.participants;

      // Проверяем и генерируем ID если отсутствуют
      participants = participants.map((p) => ({
        ...p,
        id: p.id || generateId(),
        enabled: p.enabled !== undefined ? p.enabled : true,
      }));

      if (merge) {
        const existing = this.getParticipants();
        participants = [...existing, ...participants];
      }

      this.saveParticipants(participants);
      return true;
    } catch (error) {
      console.error('Ошибка при импорте конфига:', error);
      return false;
    }
  }

  /**
   * Экспортировать конфиг в файл
   */
  exportToFile(): void {
    const config = this.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `permanent_participants_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Импортировать конфиг из файла
   */
  async importFromFile(file: File, merge: boolean = false): Promise<boolean> {
    try {
      const text = await file.text();
      return this.importConfig(text, merge);
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      return false;
    }
  }

  /**
   * Очистить всех участников
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Записать выпадение для участника
   */
  recordWin(participantId: string): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === participantId);

    if (participant) {
      const now = Date.now();
      const winEntry: WinHistoryEntry = {
        timestamp: now,
        date: new Date(now).toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      if (!participant.winHistory) {
        participant.winHistory = [];
      }

      participant.winHistory.push(winEntry);
      this.saveParticipants(participants);
    }
  }

  /**
   * Записать выпадение по имени участника (для совместимости с WheelItem)
   */
  recordWinByName(participantName: string): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.name === participantName);

    if (participant) {
      this.recordWin(participant.id);
    }
  }

  /**
   * Получить статистику по участнику
   */
  getStatistics(participantId: string): ParticipantStatistics | null {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === participantId);

    if (!participant) {
      return null;
    }

    const winHistory = participant.winHistory || [];
    const totalWins = winHistory.length;
    const lastWin = winHistory.length > 0 ? winHistory[winHistory.length - 1] : undefined;

    return {
      totalWins,
      lastWinDate: lastWin?.date,
      winDates: winHistory.map((entry) => entry.date),
    };
  }

  /**
   * Получить всю статистику по всем участникам
   */
  getAllStatistics(): Map<string, ParticipantStatistics> {
    const participants = this.getParticipants();
    const statsMap = new Map<string, ParticipantStatistics>();

    participants.forEach((participant) => {
      const stats = this.getStatistics(participant.id);
      if (stats) {
        statsMap.set(participant.id, stats);
      }
    });

    return statsMap;
  }

  /**
   * Очистить историю для конкретного участника
   */
  clearHistory(participantId: string): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === participantId);

    if (participant) {
      participant.winHistory = [];
      this.saveParticipants(participants);
    }
  }

  /**
   * Удалить конкретное выпадение из истории участника
   */
  removeWinEntry(participantId: string, timestamp: number): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === participantId);

    if (participant && participant.winHistory) {
      participant.winHistory = participant.winHistory.filter((entry) => entry.timestamp !== timestamp);
      this.saveParticipants(participants);
    }
  }

  /**
   * Добавить выпадение вручную с указанной датой
   */
  addWinEntry(participantId: string, date?: Date): void {
    const participants = this.getParticipants();
    const participant = participants.find((p) => p.id === participantId);

    if (participant) {
      const timestamp = date ? date.getTime() : Date.now();
      const winEntry: WinHistoryEntry = {
        timestamp,
        date: new Date(timestamp).toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      if (!participant.winHistory) {
        participant.winHistory = [];
      }

      participant.winHistory.push(winEntry);
      // Сортируем по времени
      participant.winHistory.sort((a, b) => a.timestamp - b.timestamp);
      this.saveParticipants(participants);
    }
  }

  /**
   * Очистить историю для всех участников
   */
  clearAllHistory(): void {
    const participants = this.getParticipants();
    participants.forEach((participant) => {
      participant.winHistory = [];
    });
    this.saveParticipants(participants);
  }

  /**
   * Генерировать случайный цвет
   */
  private generateRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 20);
    const lightness = 50 + Math.floor(Math.random() * 10);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // ============ РАБОТА С ПРЕСЕТАМИ ============

  /**
   * Получить все пресеты
   */
  getPresets(): ParticipantsPreset[] {
    try {
      const data = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (!data) return [];

      const config: PresetsConfig = JSON.parse(data);
      return config.presets || [];
    } catch (error) {
      console.error('Ошибка при загрузке пресетов:', error);
      return [];
    }
  }

  /**
   * Получить ID активного пресета
   */
  getActivePresetId(): string | null {
    try {
      const data = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (!data) return null;

      const config: PresetsConfig = JSON.parse(data);
      return config.activePresetId || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Сохранить пресеты
   */
  private savePresets(presets: ParticipantsPreset[], activePresetId: string | null): void {
    try {
      const config: PresetsConfig = {
        presets,
        activePresetId,
        version: CONFIG_VERSION,
      };
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Ошибка при сохранении пресетов:', error);
    }
  }

  /**
   * Создать новый пресет из текущих участников
   */
  createPreset(name: string): ParticipantsPreset {
    const participants = this.getParticipants();
    const presets = this.getPresets();
    const activePresetId = this.getActivePresetId();

    const newPreset: ParticipantsPreset = {
      id: generateId(),
      name,
      participants: JSON.parse(JSON.stringify(participants)), // Глубокая копия
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    presets.push(newPreset);
    this.savePresets(presets, activePresetId);

    return newPreset;
  }

  /**
   * Обновить пресет
   */
  updatePreset(presetId: string, updates: Partial<ParticipantsPreset>): void {
    const presets = this.getPresets();
    const activePresetId = this.getActivePresetId();
    const index = presets.findIndex((p) => p.id === presetId);

    if (index !== -1) {
      presets[index] = {
        ...presets[index],
        ...updates,
        updatedAt: Date.now(),
      };
      this.savePresets(presets, activePresetId);
    }
  }

  /**
   * Удалить пресет
   */
  deletePreset(presetId: string): void {
    const presets = this.getPresets();
    let activePresetId = this.getActivePresetId();

    const filtered = presets.filter((p) => p.id !== presetId);

    // Если удаляем активный пресет, сбрасываем активный
    if (activePresetId === presetId) {
      activePresetId = null;
    }

    this.savePresets(filtered, activePresetId);
  }

  /**
   * Загрузить пресет (применить к текущим участникам)
   */
  loadPreset(presetId: string): boolean {
    const presets = this.getPresets();
    const preset = presets.find((p) => p.id === presetId);

    if (!preset) return false;

    this.saveParticipants(JSON.parse(JSON.stringify(preset.participants))); // Глубокая копия
    this.savePresets(presets, presetId); // Устанавливаем как активный

    return true;
  }

  /**
   * Сохранить текущих участников в активный пресет
   */
  saveToActivePreset(): boolean {
    const activePresetId = this.getActivePresetId();
    if (!activePresetId) return false;

    const participants = this.getParticipants();
    const presets = this.getPresets();
    const index = presets.findIndex((p) => p.id === activePresetId);

    if (index !== -1) {
      presets[index].participants = JSON.parse(JSON.stringify(participants));
      presets[index].updatedAt = Date.now();
      this.savePresets(presets, activePresetId);
      return true;
    }

    return false;
  }

  /**
   * Получить активный пресет
   */
  getActivePreset(): ParticipantsPreset | null {
    const activePresetId = this.getActivePresetId();
    if (!activePresetId) return null;

    const presets = this.getPresets();
    return presets.find((p) => p.id === activePresetId) || null;
  }
}

export default new PermanentParticipantsService();
