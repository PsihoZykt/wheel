import { useCallback, useEffect, useState } from 'react';

import { PermanentParticipant, ParticipantStatistics } from '@models/permanentParticipants.model';
import PermanentParticipantsService from '@services/PermanentParticipantsService';
import { WheelItem } from '@models/wheel.model';

interface UsePermanentParticipantsResult {
  participants: PermanentParticipant[];
  enabledParticipants: PermanentParticipant[];
  wheelItems: WheelItem[];
  addParticipant: (participant: Omit<PermanentParticipant, 'id' | 'enabled'>) => PermanentParticipant;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<PermanentParticipant>) => void;
  toggleParticipant: (id: string) => void;
  recordWin: (participantId: string) => void;
  recordWinByName: (participantName: string) => void;
  getStatistics: (participantId: string) => ParticipantStatistics | null;
  clearHistory: (participantId: string) => void;
  clearAllHistory: () => void;
  exportToFile: () => void;
  importFromFile: (file: File) => Promise<boolean>;
  exportConfig: () => string;
  importConfig: (config: string) => boolean;
  reload: () => void;
}

/**
 * Хук для работы с постоянными участниками колеса
 */
export const usePermanentParticipants = (): UsePermanentParticipantsResult => {
  const [participants, setParticipants] = useState<PermanentParticipant[]>([]);

  const reload = useCallback(() => {
    const loaded = PermanentParticipantsService.getParticipants();
    setParticipants(loaded);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const enabledParticipants = participants.filter((p) => p.enabled);

  const wheelItems = PermanentParticipantsService.toWheelItems(enabledParticipants);

  const addParticipant = useCallback(
    (participant: Omit<PermanentParticipant, 'id' | 'enabled'>) => {
      const newParticipant = PermanentParticipantsService.addParticipant(participant);
      reload();
      return newParticipant;
    },
    [reload],
  );

  const removeParticipant = useCallback(
    (id: string) => {
      PermanentParticipantsService.removeParticipant(id);
      reload();
    },
    [reload],
  );

  const updateParticipant = useCallback(
    (id: string, updates: Partial<PermanentParticipant>) => {
      PermanentParticipantsService.updateParticipant(id, updates);
      reload();
    },
    [reload],
  );

  const toggleParticipant = useCallback(
    (id: string) => {
      PermanentParticipantsService.toggleParticipant(id);
      reload();
    },
    [reload],
  );

  const exportToFile = useCallback(() => {
    PermanentParticipantsService.exportToFile();
  }, []);

  const importFromFile = useCallback(
    async (file: File) => {
      const success = await PermanentParticipantsService.importFromFile(file, false);
      if (success) {
        reload();
      }
      return success;
    },
    [reload],
  );

  const exportConfig = useCallback(() => {
    return PermanentParticipantsService.exportConfig();
  }, []);

  const importConfig = useCallback(
    (config: string) => {
      const success = PermanentParticipantsService.importConfig(config, false);
      if (success) {
        reload();
      }
      return success;
    },
    [reload],
  );

  const recordWin = useCallback(
    (participantId: string) => {
      PermanentParticipantsService.recordWin(participantId);
      reload();
    },
    [reload],
  );

  const recordWinByName = useCallback(
    (participantName: string) => {
      PermanentParticipantsService.recordWinByName(participantName);
      reload();
    },
    [reload],
  );

  const getStatistics = useCallback((participantId: string) => {
    return PermanentParticipantsService.getStatistics(participantId);
  }, []);

  const clearHistory = useCallback(
    (participantId: string) => {
      PermanentParticipantsService.clearHistory(participantId);
      reload();
    },
    [reload],
  );

  const clearAllHistory = useCallback(() => {
    PermanentParticipantsService.clearAllHistory();
    reload();
  }, [reload]);

  return {
    participants,
    enabledParticipants,
    wheelItems,
    addParticipant,
    removeParticipant,
    updateParticipant,
    toggleParticipant,
    recordWin,
    recordWinByName,
    getStatistics,
    clearHistory,
    clearAllHistory,
    exportToFile,
    importFromFile,
    exportConfig,
    importConfig,
    reload,
  };
};

export default usePermanentParticipants;
