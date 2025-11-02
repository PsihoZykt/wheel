import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactText } from 'react';

import { Slot } from '@models/slot.model.ts';
import { getRandomIntInclusive, sortSlots } from '@utils/common.utils.ts';
import SaveLoadService from '@services/SaveLoadService.ts';
import { AUTOSAVE_NAME } from '@constants/slots.constants.ts';
import { addedBidsMap } from '@models/purchases.model.ts';
import slotNamesMap from '../../services/SlotNamesMap';

interface SlotsState {
  slots: Slot[];
  searchTerm: string;
}

let maxFastId = 0;

export const createSlot = (props: Partial<Slot> = {}): Slot => {
  const slot = {
    // eslint-disable-next-line no-plusplus
    fastId: ++maxFastId,
    id: Math.random().toString(),
    extra: null,
    amount: null,
    name: '',
    investors: [],
    ...props,
  };

  slotNamesMap.set(`#${slot.fastId}`, slot.id);

  return slot;
};

export const createRandomSlots = (count: number, max: number, min = 1): Slot[] =>
  sortSlots(
    Array(count)
      .fill(null)
      .map(() => {
        const amount = getRandomIntInclusive(min, max);

        return createSlot({ amount, name: amount.toString() });
      }),
  );

export const updateFastIdCounter = (slots: Slot[]): void => {
  maxFastId = Math.max(...slots.map(({ fastId }) => fastId));
};

const savedSlots = SaveLoadService.getSlots(AUTOSAVE_NAME);
const slots = savedSlots.length > 0 ? savedSlots : [createSlot()];
updateFastIdCounter(slots);
slotNamesMap.setFromList(slots);

const initialState: SlotsState = {
  // slots: [createSlot()],
  searchTerm: '',
  // slots: [
  // ...createRandomSlots(2, 20000, 10000),
  // ...createRandomSlots(5, 10000, 500),
  // ...createRandomSlots(4, 650, 600),
  // ...createRandomSlots(100, 300, 100),
  // ],
  // slots: [createSlot({ amount: 50, name: '1' }), createSlot({ amount: 50, name: '2' })],
  // slots: [...new Array(100).fill(null).map(() => createSlot({ amount: getRandomIntInclusive(10, 100), name: '100' }))],
  slots,
};

const getAmountSum = (slot: Slot): number | null => (slot.extra ? Number(slot.amount) + slot.extra : slot.amount);

const updateSlotPosition = (slots: Slot[], index: number): void => {
  if (Number(slots[index].amount) >= Number(slots[0].amount)) {
    slots.unshift(slots.splice(index, 1)[0]);
  }
};

const updateSlotAmount = (slots: Slot[], updatedId: ReactText, transform: (slot: Slot) => Slot): void => {
  const updatedIndex = slots.findIndex(({ id }) => updatedId === id);

  slots[updatedIndex] = transform(slots[updatedIndex]);
  updateSlotPosition(slots, updatedIndex);
};

const slotsSlice = createSlice({
  name: 'slots',
  initialState,
  reducers: {
    setSlotName(state, action: PayloadAction<{ id: string; name: string }>): void {
      const { id, name } = action.payload;
      state.slots = state.slots.map((slot) => {
        if (slot.id === id && slot.name != null) {
          slotNamesMap.updateName(slot.name, name, slot.id);

          return { ...slot, name };
        }

        return slot;
      });
    },
    addSlotAmount(state, action: PayloadAction<{ id: ReactText; amount: number }>): void {
      const { id, amount } = action.payload;
      updateSlotAmount(state.slots, id, (slot) => ({ ...slot, amount: (slot.amount || 0) + amount }));
    },
    setSlotAmount(state, action: PayloadAction<{ id: ReactText; amount: number }>): void {
      const { id, amount } = action.payload;
      updateSlotAmount(state.slots, id, (slot) => ({ ...slot, amount }));
    },
    setSlotExtra(state, action: PayloadAction<{ id: ReactText; extra: number }>): void {
      const { id, extra } = action.payload;
      state.slots = state.slots.map((slot) => (slot.id === id ? { ...slot, extra } : slot));
    },
    addExtra(state, action: PayloadAction<ReactText>): void {
      const id = action.payload;
      updateSlotAmount(state.slots, id, (slot) => ({ ...slot, extra: null, amount: getAmountSum(slot) }));
    },
    deleteSlot(state, action: PayloadAction<string>): void {
      const deletedId = action.payload;
      slotNamesMap.deleteBySlotId(deletedId);

      if (state.slots.length === 1) {
        state.slots = [createSlot()];
      } else {
        state.slots = state.slots.filter(({ id }) => deletedId !== id);
      }
    },
    addSlot(state, action: PayloadAction<Partial<Slot>>): void {
      const newSlot = createSlot(action?.payload);
      state.slots = [...state.slots, newSlot];
      slotNamesMap.set(`#${maxFastId}`, newSlot.id);
    },
    resetSlots(state): void {
      slotNamesMap.clear();
      addedBidsMap.clear();
      state.slots = [createSlot({ fastId: 1 })];
      updateFastIdCounter(state.slots);
    },
    setSlots(state, action: PayloadAction<Slot[]>): void {
      state.slots = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>): void {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  setSlotAmount,
  setSlotExtra,
  setSlotName,
  addExtra,
  addSlot,
  deleteSlot,
  resetSlots,
  setSlots,
  addSlotAmount,
  setSearchTerm,
} = slotsSlice.actions;

export default slotsSlice.reducer;
