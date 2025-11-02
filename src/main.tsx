import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '@styles/index.scss';

import { configureStore } from '@reduxjs/toolkit';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AnyAction, Middleware } from 'redux';
import thunk from 'redux-thunk';
import { Theme } from '@mui/material';
import { Notifications } from '@mantine/notifications';

import rootReducer, { RootState } from '@reducers/index.ts';
import { setSlots } from '@reducers/Slots/Slots.ts';
import SaveLoadService from '@services/SaveLoadService.ts';
import { sortSlots } from '@utils/common.utils.ts';
import { AUTOSAVE_NAME } from '@constants/slots.constants.ts';
import { timedFunction } from '@utils/dataType/function.utils.ts';
import { Slot } from '@models/slot.model.ts';

import ThemeWrapper from './ThemeWrapper.tsx';
import App from './App.tsx';
import MantineProvider from './MantineProvider.tsx';

const SORTABLE_SLOT_EVENTS = [
  'slots/setSlotAmount',
  'slots/addExtra',
  'slots/deleteSlot',
  'slots/addSlot',
  'slots/addSlotAmount',
  'slots/mergeLot',
];

const sortSlotsMiddleware: Middleware<{}, RootState> =
  (store) =>
  (next) =>
  (action): AnyAction => {
    const result = next(action);
    if (SORTABLE_SLOT_EVENTS.includes(action.type)) {
      const sortedSlots = sortSlots(store.getState().slots.slots);

      return next(setSlots(sortedSlots));
    }
    return result;
  };

const saveSlotsWithCooldown = timedFunction((slots: Slot[]) => {
  SaveLoadService.rewrite(slots, AUTOSAVE_NAME);
}, 2000);

const saveSlotsMiddleware: Middleware<{}, RootState> =
  (store) =>
  (next) =>
  (action): AnyAction => {
    const result = next(action);
    if (action.type.startsWith('slots')) {
      const { slots } = store.getState().slots;

      saveSlotsWithCooldown(slots);
    }
    return result;
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, sortSlotsMiddleware, saveSlotsMiddleware],
});

window.onbeforeunload = (): undefined => {
  const { slots } = store.getState().slots;

  if (slots.length > 1) {
    SaveLoadService.rewrite(slots, AUTOSAVE_NAME);
  }

  return undefined;
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <ThemeWrapper>
      <MantineProvider>
        <Notifications />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </ThemeWrapper>
  </Provider>,
);
