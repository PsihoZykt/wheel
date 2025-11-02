import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import RadioButtonGroup, { Option } from '@components/RadioButtonGroup/RadioButtonGroup.tsx';
import { DropoutVariant } from '@components/BaseWheel/BaseWheel.tsx';

const DropoutFormatField = () => {
  const dropoutVariantOptions: Option<DropoutVariant>[] = useMemo(
    () => [
      { key: DropoutVariant.New, label: 'Новое' },
      { key: DropoutVariant.Classic, label: 'Классическое' },
    ],
    [],
  );

  return (
    <Controller
      render={({ field: { onChange, value }, formState: { isSubmitting } }) => (
        <RadioButtonGroup
          fullWidth
          options={dropoutVariantOptions}
          activeKey={value}
          onChangeActive={onChange}
          disabled={isSubmitting}
        />
      )}
      name='dropoutVariant'
    />
  );
};

export default DropoutFormatField;
