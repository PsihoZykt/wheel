import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { ReactNode } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { DropoutVariant } from '@components/BaseWheel/BaseWheel.tsx';
import LoadingButton from '@components/LoadingButton/LoadingButton.tsx';
import { DropoutHelp } from '@components/RandomWheel/DropoutHelp';
import NewDropoutDescription from '@components/RandomWheel/NewDropoutDescription/NewDropoutDescription.tsx';
import ClassicDropoutDescription from '@components/RandomWheel/WheelSettings/fields/ClassicDropoutDescription.tsx';
import CoreImageField from '@components/RandomWheel/WheelSettings/fields/CoreImage.tsx';
import DropoutFormatField from '@components/RandomWheel/WheelSettings/fields/DropoutFormat.tsx';
import RandomSpinConfig from '@components/RandomWheel/WheelSettings/fields/RandomSpinConfig.tsx';
import RandomSpinSwitch from '@components/RandomWheel/WheelSettings/fields/RandomSpinSwitch.tsx';
import SpinTimeField from '@components/RandomWheel/WheelSettings/fields/SpinTime.tsx';
import SplitField from '@components/RandomWheel/WheelSettings/fields/Split.tsx';
import WheelFormatField from '@components/RandomWheel/WheelSettings/fields/WheelFormat.tsx';
import MusicSettingsField from '@components/RandomWheel/WheelSettings/fields/MusicSettings.tsx';
import { WheelFormat } from '@constants/wheel.ts';

import SuddenSpinSettingsField from './fields/SuddenSpinSettings';
import PermanentParticipantsField from './fields/PermanentParticipants';

interface WheelSettingsProps {
  nextWinner?: string;
  isLoadingSeed?: boolean;
  controls: Wheel.SettingControls;
  children: ReactNode;
  renderSubmitButton?: (defaultButton: ReactNode) => ReactNode;
  direction?: 'row' | 'column';
}

const WheelSettings = (props: WheelSettingsProps) => {
  const { isLoadingSeed, direction = 'column', controls, children, renderSubmitButton } = props;
  const {
    formState: { isSubmitting },
  } = useFormContext<Wheel.Settings>();
  const format = useWatch<Wheel.Settings>({ name: 'format' });
  const dropoutVariant = useWatch<Wheel.Settings>({ name: 'dropoutVariant' });
  const randomSpinEnabled = useWatch<Wheel.Settings>({ name: 'randomSpinEnabled' });

  const submitButton = (
    <LoadingButton
      isLoading={isLoadingSeed ?? false}
      disabled={isSubmitting}
      className='wheel-controls-button'
      variant='contained'
      color='primary'
      type='submit'
    >
      {isSubmitting ? 'Крутимся...' : 'Крутить'}
    </LoadingButton>
  );

  return (
    <Grid container spacing={2} direction={direction} flexGrow={1} className='settings'>
      <Grid container style={{ gap: 8 }} direction='column' size={direction === 'row' ? 6 : undefined}>
        <Grid container className='wheel-controls-row' spacing={1}>
          {renderSubmitButton ? renderSubmitButton(submitButton) : submitButton}
          <Grid flexGrow={1} sx={{ position: 'relative', top: -2 }}>
            {!randomSpinEnabled && <SpinTimeField />}
            {randomSpinEnabled && <RandomSpinConfig />}
          </Grid>
          <Grid>
            <RandomSpinSwitch />
          </Grid>
        </Grid>
        {controls.mode && <WheelFormatField />}
        {format === WheelFormat.Dropout && (
          <>
            <DropoutFormatField />
            <DropoutHelp />
            {dropoutVariant === DropoutVariant.New && <NewDropoutDescription />}
            {dropoutVariant === DropoutVariant.Classic && <ClassicDropoutDescription />}
          </>
        )}
        <div>{children}</div>
        {controls.split && <SplitField />}
        <MusicSettingsField />
        <SuddenSpinSettingsField />
        <PermanentParticipantsField />
        {/*{elements.randomPace && (*/}
        {/*  <>*/}
        {/*    <div className='wheel-controls-row'>*/}
        {/*      <Typography>{t('wheel.spicyFinal')}</Typography>*/}
        {/*      <Switch onChange={handleIsRandomPaceChange} />*/}
        {/*    </div>*/}
        {/*    {isRandomPace && (*/}
        {/*      <PaceSettings paceConfig={paceConfig} setPaceConfig={setPaceConfig} spinTime={spinTime} />*/}
        {/*    )}*/}
        {/*  </>*/}
        {/*)}*/}
      </Grid>
      <Grid
        flexGrow={1}
        flexBasis={0}
        minHeight={0}
        flexShrink={1}
        flexWrap='nowrap'
        container
        direction='column'
        size={direction === 'row' ? 6 : undefined}
      >
        <CoreImageField />
      </Grid>
    </Grid>
  );
};

export default WheelSettings;
