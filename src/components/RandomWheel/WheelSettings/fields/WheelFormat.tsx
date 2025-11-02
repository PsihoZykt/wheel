import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import RadioButtonGroup, { Option } from '@components/RadioButtonGroup/RadioButtonGroup.tsx';
import { WheelFormat } from '@constants/wheel.ts';
import '@components/RandomWheel/WheelSettings/fields/WheelFormat.scss';

const WheelFormatField = () => {
  const wheelOptions: Option<WheelFormat>[] = useMemo(
    () => [
      { key: WheelFormat.Default, label: 'Обычное' },
      { key: WheelFormat.Dropout, label: 'Выбывание' },
      { key: WheelFormat.BattleRoyal, label: 'Батл рояль' },
    ],
    [],
  );

  return (
    <Controller
      render={({ field: { onChange, value }, formState: { isSubmitting } }) => (
        <RadioButtonGroup
          className='wheel-format-field'
          fullWidth
          options={wheelOptions}
          activeKey={value}
          onChangeActive={onChange}
          disabled={isSubmitting}
        />
      )}
      name='format'
    />
  );
};

export default WheelFormatField;
