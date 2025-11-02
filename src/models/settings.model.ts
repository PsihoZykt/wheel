import { InsertStrategy } from '@enums/insertStrategy.enum';
import { BidNameStrategy } from '@enums/bid.enum';

export interface SettingsPreset {
  name: string;
  id: string;
}

export interface SettingsPresetLocal extends SettingsPreset {
  data: AucSettingsDto;
}

export interface DonationSettings {
  isIncrementActive: boolean;
  incrementTime: number;
}

export interface Settings extends DonationSettings {
  startTime: number;
  timeStep: number;
  isAutoincrementActive: boolean;
  autoincrementTime: number;
  isBuyoutVisible: boolean;
  background: string | null;
  purchaseSort: number;
  marblesAuc: boolean;
  marbleRate: number;
  marbleCategory: number;
  isMaxTimeActive: boolean;
  maxTime: number;
  isMinTimeActive: boolean;
  minTime: number;
  showChances: boolean;
  newSlotIncrement: number;
  isNewSlotIncrement: boolean;
  isTotalVisible: boolean;
  luckyWheelEnabled: boolean;
  luckyWheelSelectBet: boolean;
  showUpdates: boolean;
  insertStrategy: InsertStrategy;
  bidNameStrategy: BidNameStrategy;
  hideAmounts: boolean;

  // Appearance
  primaryColor: string;
  backgroundTone: string;

  events: { aukus: { enabled: boolean } };
}

export interface SettingsUpdateRequest {
  settings: Partial<AucSettingsDto>;
  id: string;
}

export interface AucSettingsDto extends Settings {}

export type SettingsForm = Partial<AucSettingsDto>;
