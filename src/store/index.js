import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import dashboardReducer from './dashboardSlice';
import transactionReducer from './transactionSlice';
import categoryReducer from './categorySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
});

export default rootReducer;
