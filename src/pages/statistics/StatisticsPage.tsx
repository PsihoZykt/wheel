import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';

import { PermanentParticipant } from '@models/permanentParticipants.model';
import PermanentParticipantsService from '@services/PermanentParticipantsService';
import { addAlert } from '@reducers/notifications/notifications';
import { AlertTypeEnum } from '@models/alert.model';

type SortField = 'name' | 'wins' | 'lastWin';
type SortOrder = 'asc' | 'desc';

interface ParticipantWithStats extends PermanentParticipant {
  totalWins: number;
  lastWinTimestamp?: number;
}

const StatisticsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState<ParticipantWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('wins');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [addWinDialogOpen, setAddWinDialogOpen] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [newWinDate, setNewWinDate] = useState('');

  const loadParticipants = () => {
    const loaded = PermanentParticipantsService.getParticipants();
    const withStats: ParticipantWithStats[] = loaded.map((p) => ({
      ...p,
      totalWins: p.winHistory?.length || 0,
      lastWinTimestamp: p.winHistory?.length ? p.winHistory[p.winHistory.length - 1].timestamp : undefined,
    }));
    setParticipants(withStats);
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю выпадений?')) {
      PermanentParticipantsService.clearAllHistory();
      loadParticipants();
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'История всех участников очищена' }));
    }
  };

  const handleClearHistory = (participantId: string, participantName: string) => {
    if (window.confirm(`Очистить историю для "${participantName}"?`)) {
      PermanentParticipantsService.clearHistory(participantId);
      loadParticipants();
      dispatch(addAlert({ type: AlertTypeEnum.Success, message: `История для "${participantName}" очищена` }));
    }
  };

  const toggleRow = (participantId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(participantId)) {
      newExpanded.delete(participantId);
    } else {
      newExpanded.add(participantId);
    }
    setExpandedRows(newExpanded);
  };

  const handleRemoveWinEntry = (participantId: string, timestamp: number) => {
    PermanentParticipantsService.removeWinEntry(participantId, timestamp);
    loadParticipants();
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Запись удалена из истории' }));
  };

  const handleOpenAddWinDialog = (participantId: string) => {
    setEditingParticipantId(participantId);
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
    if (!editingParticipantId) return;

    const date = newWinDate ? new Date(newWinDate) : new Date();
    PermanentParticipantsService.addWinEntry(editingParticipantId, date);
    loadParticipants();
    setAddWinDialogOpen(false);
    setEditingParticipantId(null);
    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Выпадение добавлено в историю' }));
  };

  const handleExportCSV = () => {
    const headers = ['Имя', 'Всего выпадений', 'Последнее выпадение', 'Даты выпадений'];
    const rows = filteredAndSortedParticipants.map((p) => {
      const lastWin = p.winHistory?.length ? p.winHistory[p.winHistory.length - 1].date : '-';
      const allWins = p.winHistory?.map((w) => w.date).join('; ') || '-';
      return [p.name, p.totalWins.toString(), lastWin, allWins];
    });

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `wheel_statistics_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    dispatch(addAlert({ type: AlertTypeEnum.Success, message: 'Статистика экспортирована в CSV' }));
  };

  const filteredAndSortedParticipants = useMemo(() => {
    const filtered = participants.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'wins':
          comparison = a.totalWins - b.totalWins;
          break;
        case 'lastWin':
          comparison = (a.lastWinTimestamp || 0) - (b.lastWinTimestamp || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [participants, searchQuery, sortField, sortOrder]);

  const totalWins = useMemo(() => participants.reduce((sum, p) => sum + p.totalWins, 0), [participants]);

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      <Stack spacing={3}>
        {/* Заголовок и действия */}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4' component='h1'>
            📊 Статистика выпадений на колесе
          </Typography>
          <Stack direction='row' spacing={1}>
            <Tooltip title='Экспортировать в CSV'>
              <IconButton onClick={handleExportCSV} color='primary'>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Очистить всю историю'>
              <IconButton onClick={handleClearAllHistory} color='warning'>
                <DeleteSweepIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Общая статистика */}
        <Stack direction='row' spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Всего участников
              </Typography>
              <Typography variant='h3'>{participants.length}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Всего прокрутов
              </Typography>
              <Typography variant='h3'>{totalWins}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Участников с выпадениями
              </Typography>
              <Typography variant='h3'>{participants.filter((p) => p.totalWins > 0).length}</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Поиск */}
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Поиск по имени участника...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />

        {/* Таблица */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Имя участника
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={sortField === 'wins'}
                    direction={sortField === 'wins' ? sortOrder : 'asc'}
                    onClick={() => handleSort('wins')}
                  >
                    Выпадений
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>
                  <TableSortLabel
                    active={sortField === 'lastWin'}
                    direction={sortField === 'lastWin' ? sortOrder : 'asc'}
                    onClick={() => handleSort('lastWin')}
                  >
                    Последнее выпадение
                  </TableSortLabel>
                </TableCell>
                <TableCell align='center'>История</TableCell>
                <TableCell align='center'>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                    <Typography color='text.secondary'>
                      {searchQuery ? 'Участники не найдены' : 'Нет участников'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedParticipants.map((participant) => {
                  const isExpanded = expandedRows.has(participant.id);
                  return (
                    <React.Fragment key={participant.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box display='flex' alignItems='center' gap={1}>
                            {participant.winHistory && participant.winHistory.length > 0 && (
                              <IconButton size='small' onClick={() => toggleRow(participant.id)}>
                                {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            )}
                            <Typography>{participant.name}</Typography>
                            {!participant.enabled && (
                              <Chip label='Отключен' size='small' variant='outlined' color='default' />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align='center'>
                          {participant.totalWins > 0 ? (
                            <Chip
                              icon={<EmojiEventsIcon />}
                              label={participant.totalWins}
                              color='success'
                              size='small'
                            />
                          ) : (
                            <Typography color='text.secondary'>-</Typography>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {participant.winHistory?.length ? (
                            <Typography variant='body2'>
                              {participant.winHistory[participant.winHistory.length - 1].date}
                            </Typography>
                          ) : (
                            <Typography color='text.secondary'>Ещё не выпадал</Typography>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {participant.winHistory?.length ? (
                            <Box>
                              {participant.winHistory.slice(-3).map((entry) => (
                                <Typography
                                  key={entry.timestamp}
                                  variant='caption'
                                  display='block'
                                  color='text.secondary'
                                >
                                  {entry.date}
                                </Typography>
                              ))}
                              {participant.winHistory.length > 3 && (
                                <Typography
                                  variant='caption'
                                  color='primary'
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => toggleRow(participant.id)}
                                >
                                  ... ещё {participant.winHistory.length - 3}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography color='text.secondary'>Ещё не выпадал</Typography>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          <Stack direction='row' spacing={0.5} justifyContent='center'>
                            <Tooltip title='Добавить выпадение'>
                              <IconButton
                                size='small'
                                onClick={() => handleOpenAddWinDialog(participant.id)}
                                color='primary'
                              >
                                <AddIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            {participant.totalWins > 0 && (
                              <Tooltip title='Очистить историю'>
                                <IconButton
                                  size='small'
                                  onClick={() => handleClearHistory(participant.id, participant.name)}
                                  color='warning'
                                >
                                  <DeleteSweepIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                      {participant.winHistory && participant.winHistory.length > 0 && (
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Typography variant='h6' gutterBottom component='div'>
                                  Полная история выпадений ({participant.winHistory.length})
                                </Typography>
                                <List dense>
                                  {[...participant.winHistory].reverse().map((entry, index) => (
                                    <ListItem
                                      key={entry.timestamp}
                                      secondaryAction={
                                        <Tooltip title='Удалить эту запись'>
                                          <IconButton
                                            edge='end'
                                            size='small'
                                            onClick={() => handleRemoveWinEntry(participant.id, entry.timestamp)}
                                            color='error'
                                          >
                                            <DeleteIcon fontSize='small' />
                                          </IconButton>
                                        </Tooltip>
                                      }
                                    >
                                      <ListItemText
                                        primary={`Выпадение #${participant?.winHistory?.length ?? 0 - index}`}
                                        secondary={entry.date}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Диалог добавления выпадения */}
      <Dialog open={addWinDialogOpen} onClose={() => setAddWinDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Добавить выпадение</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Добавьте запись о выпадении участника{' '}
              <strong>
                {editingParticipantId ? participants.find((p) => p.id === editingParticipantId)?.name : ''}
              </strong>
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
    </Box>
  );
};

export default StatisticsPage;
