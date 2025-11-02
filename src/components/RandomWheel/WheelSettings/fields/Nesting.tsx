import React from 'react';
import { Slider, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

import Hint from '@components/Hint';

interface Props {
  maxDepth?: number;
}

const Nesting = ({ maxDepth }: Props) => {
  return (
    <>
      <div className='wheel-controls-row'>
        <Typography className='wheel-controls-tip md'>
          Вложенность
          <Hint text="группирует дешевые лоты, чтобы уменьшить кол-во прокрутов" />
        </Typography>
        <Controller
          render={({ field: { onChange, value } }) => (
            <Slider
              step={1}
              min={1}
              max={maxDepth || 1}
              valueLabelDisplay='auto'
              onChange={(_, value) => onChange(value as number)}
              value={value || 1}
              marks={[
                { value: maxDepth || 1, label: maxDepth },
                { value: 1, label: '1' },
              ]}
            />
          )}
          name='depthRestriction'
        />
      </div>
    </>
  );
};

export default Nesting;
