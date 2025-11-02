import { PurchaseStatusEnum } from '@models/purchase.ts';
import { InsertStrategy } from '@enums/insertStrategy.enum';

export interface Purchase {
  timestamp: string;
  cost: number;
  username: string;
  message: string;
  color: string;
  id: string;
  source: Bid.Source;
  rewardId?: string;
  isDonation?: boolean;
  investorId?: string;
  insertStrategy?: InsertStrategy;
}

export interface PurchaseLog extends Purchase {
  status: PurchaseStatusEnum;
  target?: string;
}

export const addedBidsMap = new Map<string, string>();


