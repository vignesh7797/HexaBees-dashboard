import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import chartReducer from '../../v2/redux/chartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    chart: chartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;