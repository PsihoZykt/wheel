import React from 'react';
import { Slider } from '@mui/material';
import { Controller } from 'react-hook-form';

import Hint from '@components/Hint';

const SplitField = () => {
  return (
    <>
      <div className='wheel-controls-row'>
        <div className='wheel-controls-tip md'>
          Разделение
          <Hint text="делит дорогие лоты на несколько позиций." />
        </div>
        <Controller
          render={({ field: { onChange, value } }) => (
            <Slider
              step={0.1}
              min={0.1}
              max={1}
              valueLabelDisplay='auto'
              onChange={(_, value) => onChange(Number(value))}
              value={value}
              marks={[
                { value: 0.1, label: 'макс / 10' },
                { value: 1, label: 'макс' },
              ]}
            />
          )}
          name='split'
        />
      </div>
    </>
  );
};

export default SplitField;
