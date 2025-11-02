import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox, FormControlLabel, Grid, Slider, Typography } from '@mui/material';

const SuddenSpinSettingsField = () => {
  const { setValue } = useFormContext<Wheel.Settings>();
  const suddenSpinEnabled = useWatch<Wheel.Settings>({ name: 'suddenSpinEnabled' });
  const suddenSpinProbability = useWatch<Wheel.Settings>({ name: 'suddenSpinProbability' });

  return (
    <Grid container direction='column' spacing={1}>
      <Grid>
        <FormControlLabel
          control={
            <Controller
              name='suddenSpinEnabled'
              render={({ field: { value, onChange } }) => (
                <Checkbox checked={value || false} onChange={(_, checked) => onChange(checked)} color='primary' />
              )}
            />
          }
          label='Резкое докручивание в конце'
          className='wheel-controls-checkbox'
        />
      </Grid>
      {suddenSpinEnabled && (
        <Grid container direction='column' spacing={1} sx={{ paddingLeft: 2 }}>
          <Grid>
            <Typography variant='body2' gutterBottom>
              Вероятность докручивания: {suddenSpinProbability || 50}%
            </Typography>
          </Grid>
          <Grid sx={{ paddingRight: 2 }}>
            <Controller
              name='suddenSpinProbability'
              render={({ field: { onChange, value } }) => (
                <Slider
                  value={value || 50}
                  onChange={(_, newValue) => onChange(newValue)}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' },
                  ]}
                  valueLabelDisplay='auto'
                  valueLabelFormat={(value) => `${value}%`}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default SuddenSpinSettingsField;
