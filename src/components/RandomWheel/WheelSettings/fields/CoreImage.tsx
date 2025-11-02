import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

const CoreImageField = () => {
  const coreImage: string | null = useWatch<Wheel.Settings>({ name: 'coreImage' });
  useEffect(() => {
    if (coreImage && coreImage.length < 2500000) {
      localStorage.setItem('wheelEmote', coreImage);
    }
  }, [coreImage]);

  return null;
};

export default CoreImageField;
