namespace Wheel {
  import { ReactNode } from 'react';

  import { SpinParams } from '@components/BaseWheel/BaseWheel.tsx';
  import { DropoutVariant } from '@components/BaseWheel/BaseWheel.tsx';
  import { WheelFormat } from '@constants/wheel.ts';
  import { RandomPaceConfig } from '@services/SpinPaceService.ts';
  import { WheelItem } from '@models/wheel.model.ts';

  interface Settings {
    spinTime: number | null;
    randomSpinConfig: { min: number; max: number };
    randomSpinEnabled: boolean;

    format: WheelFormat;
    paceConfig: RandomPaceConfig;
    split: number;

    maxDepth: number | null;
    depthRestriction: number | null;

    dropoutVariant: DropoutVariant;

    coreImage?: string | null;

    // Настройки музыки
    musicTrackId?: string | null; // ID трека из списка или 'random'
    musicEnabled?: boolean;

    // Настройки резкого докручивания
    suddenSpinEnabled?: boolean; // Включить резкое докручивание
    suddenSpinProbability?: number; // Вероятность срабатывания (0-100)
  }

  interface SettingControls {
    mode: boolean;
    split: boolean;
    randomPace: boolean;
    import: boolean;
  }

  interface FormatHook {
    init?: (items: WheelItem[]) => void;
    onSpinStart?: () => Partial<SpinParams> | undefined;
    onSpinEnd?: (winner: WheelItem) => void | Promise<void>;
    items: WheelItem[];
    content?: ReactNode;
    renderSubmitButton?: (defaultButton: ReactNode) => ReactNode;
    extraSettings?: ReactNode;
  }
}
