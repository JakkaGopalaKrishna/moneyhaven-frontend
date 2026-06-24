import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import dashboardReducer from './dashboardSlice';
import transactionReducer from './transactionSlice';
import categoryReducer from './categorySlice';
import budgetReducer from './budgetSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
  budgets: budgetReducer,
});

export default rootReducer;
