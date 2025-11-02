import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HistoryIcon from '@mui/icons-material/History';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SaveIcon from '@mui/icons-material/Save';
import FolderIcon from '@mui/icons-material/Folder';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { MenuItem, Select, FormControl, InputLabel, Chip, Tabs, Tab, FormControlLabel, Switch } from '@mui/material';

import { PermanentParticipant, ParticipantsPreset } from '@models/permanentParticipants.model';
import { WheelItem } from '@models/wheel.model';
import PermanentParticipantsService from '@services/PermanentParticipantsService';
import { WheelContext } from '@components/RandomWheel/WheelSettings/WheelContext';
import { addAlert } from '@reducers/notifications/notifications';
import { AlertTypeEnum } from '@models/alert.model';

interface PermanentParticipantsModalProps {
  opened: boolean;
  onClose: () => void;
  onLoadToWheel?: (items: WheelItem[]) => void; // Опциональный проп для обновления колеса
}

const PermanentParticipantsModal: React.FC<PermanentParticipantsModalProps> = ({ opened, onClose, onLoadToWheel }) => {
  const dispatch = useDispatch();
  const wheelContext = useContext(WheelContext);
  const [participants, setParticipants] = useState<PermanentParticipant[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [tempParticipantsDialogOpen, setTempParticipantsDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<PermanentParticipant | null>(null);
  const [viewingHistoryParticipant, setViewingHistoryParticipant] = useState<PermanentParticipant | null>(null);
  const [formData, setFormData] = useState({ name: '', amount: 1, color: '', image: '' });
  const [tempParticipantsText, setTempParticipantsText] = useState('');
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<ParticipantsPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [tempParticipants, setTempParticipants] = useState<PermanentParticipant[]>([]); // Временные участники
  const [autoWeightEnabled, setAutoWeightEnabled] = useState(false); // Автоматический расчет весов
  const [addWinDialogOpen, setAddWinDialogOpen] = useState(false);
  const [newWinDate, setNewWinDate] = useState('');

  const loadParticipants = () => {
    const loaded = PermanentParticipantsService.getParticipants();
    setParticipants(loaded);
  };

  const loadPresets = () => {
    const loadedPresets = PermanentParticipantsService.getPresets();
    const activeId = PermanentParticipantsService.getActivePresetId();
    setPresets(loadedPresets);
    setActivePresetId(activeId);
  };

  useEffect(() => {
    if (opened) {
      loadParticipants();
      loadPresets();
    }
  }, [opened]);

  const updateWheel = useCallback(
    (updatedParticipants: PermanentParticipant[]) => {
      const wheelItems = PermanentParticipantsService.toWheelItems(updatedParticipants.filter((p) => p.enabled));

      // Используем переданную функцию или функцию из контекста
      if (onLoadToWheel) {
        onLoadToWheel(wheelItems);
      } else if (wheelContext?.changeInitialItems) {
        wheelContext.changeInitialItems(wheelItems);
      }
    },
    [onLoadToWheel, wheelContext],
  );

  const handleToggleParticipant = (id: string) => {
    PermanentParticipantsService.toggleParticipant(id);
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    updateWheel(updated);
  };

  const handleDeleteParticipant = (id: string) => {
    PermanentParticipantsService.removeParticipant(id);
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    updateWheel(updated);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Участник удален' }));
  };

  const handleOpenAddDialog = () => {
    setEditingParticipant(null);
    setFormData({ name: '', amount: 1, color: '', image: '' });
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (participant: PermanentParticipant) => {
    setEditingParticipant(participant);
    setFormData({
      name: participant.name,
      amount: participant.amount || 1,
      color: participant.color || '',
      image: participant.image || '',
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingParticipant(null);
    setFormData({ name: '', amount: 1, color: '', image: '' });
  };

  const handleOpenHistoryDialog = (participant: PermanentParticipant) => {
    setViewingHistoryParticipant(participant);
    setHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
    setViewingHistoryParticipant(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Пожалуйста, выберите изображение' }));
      return;
    }

    // Проверка размера (макс 2MB)
    if (file.size > 2 * 1024 * 1024) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Изображение слишком большое (макс 2MB)' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData({ ...formData, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
  };

  const handleClearHistory = (participantId: string) => {
    if (!window.confirm('Вы уверены, что хотите очистить всю историю выпадений?')) return;

    PermanentParticipantsService.clearHistory(participantId);
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    setViewingHistoryParticipant(updated.find((p) => p.id === participantId) || null);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'История выпадений очищена' }));
  };

  const handleRemoveWinEntry = (participantId: string, timestamp: number) => {
    PermanentParticipantsService.removeWinEntry(participantId, timestamp);
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    setViewingHistoryParticipant(updated.find((p) => p.id === participantId) || null);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Запись удалена из истории' }));
  };

  const handleOpenAddWinDialog = () => {
    // Устанавливаем текущую дату и время по умолчанию
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setNewWinDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    setAddWinDialogOpen(true);
  };

  const handleAddWinEntry = () => {
    if (!viewingHistoryParticipant) return;

    const date = newWinDate ? new Date(newWinDate) : new Date();
    PermanentParticipantsService.addWinEntry(viewingHistoryParticipant.id, date);
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    setViewingHistoryParticipant(updated.find((p) => p.id === viewingHistoryParticipant.id) || null);
    setAddWinDialogOpen(false);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Выпадение добавлено в историю' }));
  };

  const handleClearAllHistory = () => {
    PermanentParticipantsService.clearAllHistory();
    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'История всех участников очищена' }));
  };

  const handleSaveParticipant = () => {
    if (!formData.name.trim()) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Имя участника не может быть пустым' }));
      return;
    }

    if (editingParticipant) {
      PermanentParticipantsService.updateParticipant(editingParticipant.id, {
        name: formData.name,
        amount: formData.amount,
        color: formData.color || undefined,
        image: formData.image || undefined,
      });
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Участник обновлен' }));
    } else {
      PermanentParticipantsService.addParticipant({
        name: formData.name,
        amount: formData.amount,
        color: formData.color || undefined,
        image: formData.image || undefined,
      });
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Участник добавлен' }));
    }

    const updated = PermanentParticipantsService.getParticipants();
    setParticipants(updated);
    updateWheel(updated);
    handleCloseEditDialog();
  };

  const handleExport = () => {
    PermanentParticipantsService.exportToFile();
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Конфиг экспортирован' }));
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await PermanentParticipantsService.importFromFile(file, false);
    if (success) {
      const updated = PermanentParticipantsService.getParticipants();
      setParticipants(updated);
      updateWheel(updated);
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Конфиг импортирован' }));
    } else {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Ошибка при импорте конфига' }));
    }

    event.target.value = '';
  };

  const handleLoadToWheel = () => {
    const updated = PermanentParticipantsService.getParticipants();
    updateWheel(updated);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Участники загружены в колесо' }));
  };

  const handleCopyToClipboard = async () => {
    try {
      const config = PermanentParticipantsService.exportConfig();
      await navigator.clipboard.writeText(config);
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Конфиг скопирован в буфер обмена' }));
    } catch (error) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Ошибка при копировании в буфер обмена' }));
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const success = PermanentParticipantsService.importConfig(text, false);
      if (success) {
        const updated = PermanentParticipantsService.getParticipants();
        setParticipants(updated);
        updateWheel(updated);
        dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Конфиг импортирован из буфера обмена' }));
      } else {
        dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Ошибка при импорте конфига' }));
      }
    } catch (error) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Ошибка при чтении буфера обмена' }));
    }
  };

  // Пресеты
  const handleCreatePreset = () => {
    if (!presetName.trim()) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Введите название пресета' }));
      return;
    }

    PermanentParticipantsService.createPreset(presetName);
    loadPresets();
    setPresetName('');
    setPresetDialogOpen(false);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: `Пресет "${presetName}" создан` }));
  };

  const handleLoadPreset = (presetId: string) => {
    const success = PermanentParticipantsService.loadPreset(presetId);
    if (success) {
      loadParticipants();
      loadPresets();
      updateWheel(PermanentParticipantsService.getParticipants());
      const preset = presets.find((p) => p.id === presetId);
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: `Пресет "${preset?.name}" загружен` }));
    }
  };

  const handleDeletePreset = (presetId: string, presetName: string) => {
    if (window.confirm(`Удалить пресет "${presetName}"?`)) {
      PermanentParticipantsService.deletePreset(presetId);
      loadPresets();
      loadParticipants();
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: `Пресет "${presetName}" удален` }));
    }
  };

  // Временные участники
  const handleOpenTempParticipantsDialog = () => {
    // Загружаем текущих постоянных участников в текстовое поле
    const currentParticipants = participants
      .map((p) => `${p.name}${p.amount && p.amount !== 1 ? `,${p.amount}` : ''}`)
      .join('\n');
    setTempParticipantsText(currentParticipants);
    setTempParticipantsDialogOpen(true);
  };

  const handleAddTempParticipants = () => {
    if (!tempParticipantsText.trim()) {
      dispatch(addAlert({ type: AlertTypeEnum.Error, message: 'Введите участников' }));
      return;
    }

    const lines = tempParticipantsText.split('\n').filter((line) => line.trim());
    const allParticipants: PermanentParticipant[] = lines.map((line, index) => {
      const parts = line.split(',').map((p) => p.trim());
      const name = parts[0];
      const amount = parts[1] ? parseInt(parts[1]) : 1;

      return {
        id: `temp_${Date.now()}_${index}_${Math.random()}`,
        name,
        amount,
        enabled: true,
        color: `hsl(${Math.floor(Math.random() * 360)}, 65%, 55%)`,
      };
    });

    // Определяем, какие участники новые (временные)
    const permanentNames = new Set(participants.map((p) => p.name));
    const newTempParticipants = allParticipants.filter((p) => !permanentNames.has(p.name));
    setTempParticipants(newTempParticipants);

    const wheelItems = PermanentParticipantsService.toWheelItems(allParticipants);

    // Используем переданную функцию или функцию из контекста
    if (onLoadToWheel) {
      onLoadToWheel(wheelItems);
    } else if (wheelContext?.changeInitialItems) {
      wheelContext.changeInitialItems(wheelItems);
    }

    setTempParticipantsText('');
    setTempParticipantsDialogOpen(false);
    dispatch(
      addAlert({
        type: AlertTypeEnum.Success,
        message: `${allParticipants.length} участников загружены в колесо (${newTempParticipants.length} временных)`,
      }),
    );
  };

  // Удалить временного участника
  const handleDeleteTempParticipant = (id: string) => {
    setTempParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // Расчет автоматических весов на основе истории выпадений
  const calculateAutoWeights = useCallback(() => {
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

    // Обновляем только колесо (без сохранения в состояние)
    updateWheel(updatedParticipants);

    dispatch(
      addAlert({
        type: AlertTypeEnum.Success,
        message: 'Веса пересчитаны для текущего прокрута (не сохранены)',
      }),
    );
  }, [participants, updateWheel, dispatch]);

  // Обработчик переключения автоматического расчета весов
  const handleAutoWeightToggle = (checked: boolean) => {
    setAutoWeightEnabled(checked);
    if (checked) {
      calculateAutoWeights();
    }
  };

  // Объединяем постоянных и временных участников для отображения
  const allDisplayParticipants = [...participants, ...tempParticipants];
  const enabledCount = allDisplayParticipants.filter((p) => p.enabled).length;
  const totalCount = allDisplayParticipants.length;

  return (
    <>
      <Dialog open={opened} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>
          <Stack spacing={2}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h6'>Управление участниками</Typography>
              <Stack direction='row' spacing={0.5}>
                <Tooltip title='Редактировать и добавить участников'>
                  <IconButton onClick={handleOpenTempParticipantsDialog} color='secondary' size='small'>
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Импортировать из файла'>
                  <IconButton component='label' color='primary' size='small'>
                    <FileUploadIcon />
                    <input type='file' hidden accept='application/json' onChange={handleImport} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Экспортировать в файл'>
                  <IconButton onClick={handleExport} color='primary' size='small'>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Скопировать в буфер обмена'>
                  <IconButton onClick={handleCopyToClipboard} color='primary' size='small'>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Вставить из буфера обмена'>
                  <IconButton onClick={handlePasteFromClipboard} color='primary' size='small'>
                    <ContentPasteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Добавить участника'>
                  <IconButton onClick={handleOpenAddDialog} color='primary' size='small'>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
            <Box display='flex' gap={1} alignItems='center'>
              <FormControl size='small' sx={{ minWidth: 200 }}>
                <InputLabel>Пресет</InputLabel>
                <Select value={activePresetId || ''} label='Пресет' onChange={(e) => handleLoadPreset(e.target.value)}>
                  <MenuItem value=''>
                    <em>Без пресета</em>
                  </MenuItem>
                  {presets.map((preset) => (
                    <MenuItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title='Создать пресет из текущих участников'>
                <IconButton onClick={() => setPresetDialogOpen(true)} color='primary' size='small'>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              {activePresetId && (
                <Tooltip title='Удалить текущий пресет'>
                  <IconButton
                    onClick={() => {
                      const preset = presets.find((p) => p.id === activePresetId);
                      if (preset) handleDeletePreset(activePresetId, preset.name);
                    }}
                    color='error'
                    size='small'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              {activePresetId && (
                <Chip
                  label={`Активен: ${presets.find((p) => p.id === activePresetId)?.name}`}
                  color='primary'
                  size='small'
                />
              )}
            </Box>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {allDisplayParticipants.length === 0 ? (
            <Box textAlign='center' py={4}>
              <Typography variant='body1' color='text.secondary' gutterBottom>
                Нет участников
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Нажмите "+" чтобы добавить участника или 👤+ чтобы загрузить временных
              </Typography>
              <Stack direction='row' spacing={1} justifyContent='center'>
                <Button variant='contained' startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
                  Добавить постоянного
                </Button>
                <Button variant='outlined' startIcon={<PersonAddIcon />} onClick={handleOpenTempParticipantsDialog}>
                  Загрузить временных
                </Button>
              </Stack>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {allDisplayParticipants.map((participant) => {
                const isTemp = tempParticipants.some((tp) => tp.id === participant.id);
                return (
                  <ListItem
                    key={participant.id}
                    secondaryAction={
                      <Stack direction='row' spacing={0.5}>
                        {!isTemp && (
                          <>
                            <Tooltip title='История выпадений'>
                              <IconButton edge='end' size='small' onClick={() => handleOpenHistoryDialog(participant)}>
                                <HistoryIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Редактировать'>
                              <IconButton edge='end' size='small' onClick={() => handleOpenEditDialog(participant)}>
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title='Удалить'>
                          <IconButton
                            edge='end'
                            size='small'
                            onClick={() =>
                              isTemp
                                ? handleDeleteTempParticipant(participant.id)
                                : handleDeleteParticipant(participant.id)
                            }
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                    sx={{
                      opacity: participant.enabled ? 1 : 0.5,
                      transition: 'opacity 0.2s',
                      bgcolor: isTemp ? 'action.hover' : 'transparent',
                      '&:hover': {
                        backgroundColor: isTemp ? 'action.selected' : 'action.hover',
                      },
                    }}
                  >
                    <Checkbox
                      checked={participant.enabled}
                      onChange={() => !isTemp && handleToggleParticipant(participant.id)}
                      edge='start'
                      disabled={isTemp}
                    />
                    {/* Превью цвета/изображения */}
                    {participant.image ? (
                      <Box
                        component='img'
                        src={participant.image}
                        alt={participant.name}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '2px solid',
                          borderColor: 'divider',
                          mr: 2,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: participant.color || '#ccc',
                          borderRadius: 1,
                          border: '2px solid',
                          borderColor: 'divider',
                          mr: 2,
                        }}
                      />
                    )}
                    <ListItemText
                      primary={
                        <Box display='flex' alignItems='center' gap={1}>
                          <span>{participant.name}</span>
                          {isTemp && (
                            <Chip
                              label='Временный'
                              size='small'
                              color='warning'
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {!isTemp && (participant.winHistory?.length || 0) > 0 && (
                            <Tooltip title='Количество выпадений'>
                              <Box
                                component='span'
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  px: 0.75,
                                  py: 0.25,
                                  borderRadius: 1,
                                  bgcolor: 'success.main',
                                  color: 'success.contrastText',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                <EmojiEventsIcon sx={{ fontSize: '0.875rem' }} />
                                {participant.winHistory?.length}
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      }
                      secondary={`Вес: ${participant.amount || 1}${isTemp ? ' (только для текущего прокрута)' : ''}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Box display='flex' justifyContent='space-between' width='100%' px={1}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography variant='body2' color='text.secondary'>
                Всего: {totalCount} ({participants.length} постоянных
                {tempParticipants.length > 0 && `, ${tempParticipants.length} временных`})
              </Typography>
              <Tooltip title='Очистить историю всех участников'>
                <IconButton size='small' onClick={handleClearAllHistory} color='warning'>
                  <DeleteSweepIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction='row' spacing={1}>
              <Button onClick={onClose}>Закрыть</Button>
              <Button
                variant='contained'
                onClick={() => {
                  handleLoadToWheel();
                  onClose();
                }}
                disabled={enabledCount === 0}
              >
                Загрузить в колесо
              </Button>
            </Stack>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Диалог истории выпадений */}
      <Dialog open={historyDialogOpen} onClose={handleCloseHistoryDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>История выпадений: {viewingHistoryParticipant?.name}</Typography>
            <Stack direction='row' spacing={0.5}>
              <Tooltip title='Добавить выпадение вручную'>
                <IconButton size='small' onClick={handleOpenAddWinDialog} color='primary'>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              {(viewingHistoryParticipant?.winHistory?.length || 0) > 0 && (
                <Tooltip title='Очистить всю историю'>
                  <IconButton
                    size='small'
                    onClick={() => viewingHistoryParticipant && handleClearHistory(viewingHistoryParticipant.id)}
                    color='warning'
                  >
                    <DeleteSweepIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {!viewingHistoryParticipant?.winHistory || viewingHistoryParticipant.winHistory.length === 0 ? (
            <Box textAlign='center' py={4}>
              <Typography variant='body1' color='text.secondary' gutterBottom>
                Пока нет выпадений
              </Typography>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={handleOpenAddWinDialog} sx={{ mt: 2 }}>
                Добавить вручную
              </Button>
            </Box>
          ) : (
            <>
              <Box mb={2}>
                <Typography variant='body2' color='text.secondary'>
                  Всего выпадений: <strong>{viewingHistoryParticipant.winHistory.length}</strong>
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Последнее выпадение:{' '}
                  <strong>
                    {viewingHistoryParticipant.winHistory[viewingHistoryParticipant.winHistory.length - 1].date}
                  </strong>
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {[...viewingHistoryParticipant.winHistory].reverse().map((entry, index) => (
                  <ListItem
                    key={entry.timestamp}
                    secondaryAction={
                      <Tooltip title='Удалить эту запись'>
                        <IconButton
                          edge='end'
                          size='small'
                          onClick={() =>
                            viewingHistoryParticipant &&
                            handleRemoveWinEntry(viewingHistoryParticipant.id, entry.timestamp)
                          }
                          color='error'
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={`Выпадение #${viewingHistoryParticipant.winHistory!.length - index}`}
                      secondary={entry.date}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления выпадения вручную */}
      <Dialog open={addWinDialogOpen} onClose={() => setAddWinDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Добавить выпадение</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Добавьте запись о выпадении участника <strong>{viewingHistoryParticipant?.name}</strong>
            </Typography>
            <TextField
              label='Дата и время'
              type='datetime-local'
              value={newWinDate}
              onChange={(e) => setNewWinDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography variant='caption' color='text.secondary'>
              💡 Укажите дату и время выпадения. По умолчанию используется текущее время.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWinDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddWinEntry} variant='contained' startIcon={<AddIcon />}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления/редактирования участника */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{editingParticipant ? 'Редактировать участника' : 'Добавить участника'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='Имя участника'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label='Вес (количество)'
              type='number'
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 1 }}
            />

            <Divider sx={{ my: 1 }}>Оформление сектора</Divider>

            <TextField
              label='Цвет (HEX, RGB или название)'
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              fullWidth
              placeholder='#FF5733, rgb(255, 87, 51) или red'
              helperText='Оставьте пустым для случайного цвета'
              InputProps={{
                endAdornment: formData.color && (
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: formData.color,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  />
                ),
              }}
            />

            <Box>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Изображение для сектора (вместо цвета)
              </Typography>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Button variant='outlined' component='label' startIcon={<ImageIcon />} size='small'>
                  Загрузить изображение
                  <input type='file' hidden accept='image/*' onChange={handleImageUpload} />
                </Button>
                {formData.image && (
                  <>
                    <Chip
                      label='Изображение загружено'
                      onDelete={handleRemoveImage}
                      deleteIcon={<CloseIcon />}
                      color='success'
                      size='small'
                    />
                    <Box
                      component='img'
                      src={formData.image}
                      alt='Превью'
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  </>
                )}
              </Stack>
              <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 1 }}>
                💡 Если загружено изображение, оно будет использоваться вместо цвета. Макс 2MB.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Отмена</Button>
          <Button onClick={handleSaveParticipant} variant='contained'>
            {editingParticipant ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог создания пресета */}
      <Dialog open={presetDialogOpen} onClose={() => setPresetDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Создать пресет</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Создайте пресет из текущих участников для быстрого переключения между разными списками
            </Typography>
            <TextField
              label='Название пресета'
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              fullWidth
              autoFocus
              placeholder='Например: Основной стрим, Турнир, Подписчики'
            />
            <Typography variant='caption' color='text.secondary'>
              Будет сохранено участников: {participants.length}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPresetDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCreatePreset} variant='contained' startIcon={<SaveIcon />}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления/редактирования участников для прокрута */}
      <Dialog
        open={tempParticipantsDialogOpen}
        onClose={() => setTempParticipantsDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Редактировать участников для прокрута</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ bgcolor: 'info.main', color: 'info.contrastText', p: 2, borderRadius: 1 }}>
              <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                💡 Как использовать:
              </Typography>
              <Typography variant='body2' component='div'>
                • Ниже показаны все текущие постоянные участники
                <br />
                • Вы можете редактировать список, удалять или изменять участников
                <br />
                • Чтобы добавить нового участника, просто впишите его имя в конец списка
                <br />• Формат: <code>Имя</code> или <code>Имя,Вес</code>
              </Typography>
            </Box>
            <TextField
              label='Список участников для прокрута'
              value={tempParticipantsText}
              onChange={(e) => setTempParticipantsText(e.target.value)}
              fullWidth
              multiline
              rows={15}
              autoFocus
              placeholder='Игрок1&#10;Игрок2,5&#10;Игрок3,2'
              helperText={`Всего участников: ${tempParticipantsText.split('\n').filter((line) => line.trim()).length}`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTempParticipantsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddTempParticipants} variant='contained' color='primary' size='large'>
            Загрузить в колесо ({tempParticipantsText.split('\n').filter((line) => line.trim()).length})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PermanentParticipantsModal;
