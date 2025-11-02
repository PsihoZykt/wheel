import React, { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox, FormControlLabel, Grid, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';
import { MUSIC_TRACKS, RANDOM_TRACK_ID } from '@constants/music.ts';

const MusicSettingsField = () => {
  const { setValue } = useFormContext<Wheel.Settings>();
  const musicEnabled = useWatch<Wheel.Settings>({ name: 'musicEnabled' });
  const musicTrackId = useWatch<Wheel.Settings>({ name: 'musicTrackId' });

  // Сохраняем настройки в localStorage при изменении
  useEffect(() => {
    if (musicTrackId !== undefined) {
      localStorage.setItem('wheelMusicTrackId', musicTrackId || '');
    }
  }, [musicTrackId]);

  useEffect(() => {
    if (musicEnabled !== undefined) {
      localStorage.setItem('wheelMusicEnabled', String(musicEnabled));
    }
  }, [musicEnabled]);

  return (
    <Grid container direction='column' spacing={1}>
      <Grid>
        <FormControlLabel
          control={
            <Controller
              name='musicEnabled'
              render={({ field: { value, onChange } }) => (
                <Checkbox checked={value || false} onChange={(_, checked) => onChange(checked)} color='primary' />
              )}
            />
          }
          label='Музыка во время вращения'
          className='wheel-controls-checkbox'
        />
      </Grid>
      {musicEnabled && (
        <Grid>
          <Controller
            name='musicTrackId'
            render={({ field: { onChange, value } }) => (
              <FormControl
                className='wheel-controls-input'
                variant='outlined'
                margin='dense'
                fullWidth
                sx={{ minWidth: 250 }}
              >
                <InputLabel>Выбор трека</InputLabel>
                <Select
                  value={value || RANDOM_TRACK_ID}
                  onChange={(e) => onChange(e.target.value || RANDOM_TRACK_ID)}
                  label='Выбор трека'
                >
                  <MenuItem value={RANDOM_TRACK_ID}>🎲 Случайная песня</MenuItem>
                  {MUSIC_TRACKS.map((track) => (
                    <MenuItem key={track.id} value={track.id}>
                      {track.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default MusicSettingsField;
