import { FC, Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Group, Checkbox, Stack } from '@mantine/core';

import PageContainer from '@components/PageContainer/PageContainer';
import RandomWheel, { RandomWheelController } from '@components/RandomWheel/RandomWheel';
import PermanentParticipantsModal from '@components/RandomWheel/WheelSettings/fields/PermanentParticipantsModal';
import { Slot } from '@models/slot.model';
import { WheelItem } from '@models/wheel.model';
import { RootState } from '@reducers';
import { deleteSlot, setSlots } from '@reducers/Slots/Slots';
import { addAlert } from '@reducers/notifications/notifications';
import { AlertTypeEnum } from '@models/alert.model';
import PermanentParticipantsService from '@services/PermanentParticipantsService';
import { slotToWheel } from '@utils/slots.utils';

const WheelPage: FC = () => {
  const dispatch = useDispatch();
  const { slots } = useSelector((rootReducer: RootState) => rootReducer.slots);
  const wheelController = useRef<RandomWheelController | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [autoWeightEnabled, setAutoWeightEnabled] = useState(false);
  const [rigEnabled, setRigEnabled] = useState(true);

  const wheelItems = useMemo(() => slots.map<WheelItem>(slotToWheel), [slots]);

  // Автоматическая загрузка постоянных участников при монтировании
  useEffect(() => {
    const permanentParticipants = PermanentParticipantsService.getEnabledParticipants();
    if (permanentParticipants.length > 0) {
      const wheelItemsFromPermanent = PermanentParticipantsService.toWheelItems(permanentParticipants);
      wheelController.current?.setItems(wheelItemsFromPermanent as any);
    }
  }, []);

  const setCustomWheelItems = useCallback(
    (customItems: Slot[], saveSlots: boolean) => {
      wheelController.current?.setItems(customItems.map(slotToWheel) as any);

      if (saveSlots) {
        dispatch(setSlots(customItems));
      }
    },
    [dispatch],
  );

  const handleLoadToWheel = useCallback((items: WheelItem[]) => {
    wheelController.current?.setItems(items as any);
  }, []);

  // Расчет автоматических весов на основе истории выпадений (только для текущего прокрута)
  const calculateAutoWeights = useCallback(() => {
    const participants = PermanentParticipantsService.getParticipants();

    // Разделяем участников на тех, у кого есть история, и тех, у кого нет
    const participantsWithHistory = participants.filter((p) => p.winHistory && p.winHistory.length > 0);
    const participantsWithoutHistory = participants.filter((p) => !p.winHistory || p.winHistory.length === 0);

    // Сортируем участников с историей по времени последнего выпадения (от недавних к давним)
    const sortedByTime = [...participantsWithHistory].sort((a, b) => {
      const timeA = a.winHistory![a.winHistory!.length - 1].timestamp;
      const timeB = b.winHistory![b.winHistory!.length - 1].timestamp;
      return timeB - timeA; // Сначала недавние (большие timestamp)
    });

    // Присваиваем веса на основе ранга
    const totalWithHistory = sortedByTime.length;
    const rankedParticipants = sortedByTime.map((p, index) => {
      // Ранг: 0 = самый недавний, totalWithHistory-1 = самый давний
      const rank = index;

      let weight;
      if (totalWithHistory === 1) {
        // Если только один участник с историей - средний вес
        weight = 0.55;
      } else {
        // Распределяем веса равномерно от 0.1 (недавний) до 1.0 (давний)
        weight = 0.1 + (rank / (totalWithHistory - 1)) * 0.9;
      }

      return {
        ...p,
        amount: Math.round(weight * 100) / 100,
      };
    });

    // Участники без истории получают вес 1.0
    const participantsWithoutHistoryUpdated = participantsWithoutHistory.map((p) => ({
      ...p,
      amount: 1,
    }));

    // Собираем обратно в исходном порядке
    const updatedParticipants = participants.map((p) => {
      const withHistory = rankedParticipants.find((rp) => rp.id === p.id);
      if (withHistory) return withHistory;

      const withoutHistory = participantsWithoutHistoryUpdated.find((wp) => wp.id === p.id);
      return withoutHistory || p;
    });

    // НЕ сохраняем в localStorage - применяем только к текущему колесу
    // PermanentParticipantsService.saveParticipants(updatedParticipants);

    // Обновляем только колесо (без сохранения)
    const enabledParticipants = updatedParticipants.filter((p) => p.enabled);
    const wheelItemsFromPermanent = PermanentParticipantsService.toWheelItems(enabledParticipants);
    wheelController.current?.setItems(wheelItemsFromPermanent as any);

    dispatch(
      addAlert({
        type: AlertTypeEnum.Success,
        message: 'Веса пересчитаны для текущего прокрута (не сохранены)',
      }),
    );
  }, [dispatch]);

  // При выключении чекбокса - восстанавливаем исходные веса
  const resetToOriginalWeights = useCallback(() => {
    const participants = PermanentParticipantsService.getParticipants();
    const enabledParticipants = participants.filter((p) => p.enabled);
    const wheelItemsFromPermanent = PermanentParticipantsService.toWheelItems(enabledParticipants);
    wheelController.current?.setItems(wheelItemsFromPermanent as any);
  }, []);

  // Обработчик переключения автоматического расчета весов
  const handleAutoWeightToggle = useCallback(
    (checked: boolean) => {
      setAutoWeightEnabled(checked);
      if (checked) {
        calculateAutoWeights();
      } else {
        // При выключении - восстанавливаем исходные веса
        resetToOriginalWeights();
      }
    },
    [calculateAutoWeights, resetToOriginalWeights],
  );

  // Настраиваем автоматический пересчет весов после каждого выпадения
  useEffect(() => {
    if (autoWeightEnabled) {
      // Устанавливаем глобальный обработчик для пересчета после выпадения
      (window as any).__autoRecalculateWeights = () => {
        // Небольшая задержка, чтобы история успела обновиться
        setTimeout(() => {
          calculateAutoWeights();
        }, 100);
      };
    } else {
      // Удаляем обработчик, если чекбокс выключен
      delete (window as any).__autoRecalculateWeights;
    }

    return () => {
      delete (window as any).__autoRecalculateWeights;
    };
  }, [autoWeightEnabled, calculateAutoWeights]);

  const deleteItem = (id: Key) => {
    dispatch(deleteSlot(id.toString()));
  };

  const title = (
    <Stack gap='xs'>
      <Group align='center' gap='md' style={{ alignItems: 'center' }}>
        <span style={{ lineHeight: '1' }}>Колесо</span>
        <Button variant='outline' onClick={() => setModalOpen(true)} style={{ alignSelf: 'self-end' }}>
          Редактировать список участников
        </Button>
      </Group>
      <Group>
        <Checkbox
          checked={autoWeightEnabled}
          onChange={(e) => handleAutoWeightToggle(e.currentTarget.checked)}
          label='Автоматический расчет весов на основе истории выпадений'
          description='Только для текущего прокрута: самый недавний = 0.1, самый давний = 1.0 (не сохраняется)'
        />
      </Group>
      <Group>
        <Checkbox
          checked={rigEnabled}
          onChange={(e) => setRigEnabled(e.currentTarget.checked)}
          label='Включить подкрутку (experimental)'
          disabled
        />
      </Group>
    </Stack>
  );

  return (
    <PageContainer className='wheel-wrapper padding' title={title}>
      <RandomWheel items={wheelItems} deleteItem={deleteItem} wheelRef={wheelController} />
      <PermanentParticipantsModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoadToWheel={handleLoadToWheel}
      />
    </PageContainer>
  );
};

export default WheelPage;
