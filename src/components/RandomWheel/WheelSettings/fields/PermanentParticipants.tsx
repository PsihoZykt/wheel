import React, { useEffect } from 'react';

import PermanentParticipantsService from '@services/PermanentParticipantsService';

const PermanentParticipantsField: React.FC = () => {
  // Функция для записи выпадения (будет вызываться извне)
  useEffect(() => {
    // Создаем глобальный обработчик для записи выпадений
    (window as any).__recordPermanentParticipantWin = (winnerName: string) => {
      PermanentParticipantsService.recordWinByName(winnerName);
    };

    return () => {
      delete (window as any).__recordPermanentParticipantWin;
    };
  }, []);

  return null;
};

export default PermanentParticipantsField;
