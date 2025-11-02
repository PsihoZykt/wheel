import { combineReducers } from '@reduxjs/toolkit';

import slots from './Slots/Slots';
import notifications from './notifications/notifications';

const rootReducer = combineReducers({
  slots,
  notifications,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
