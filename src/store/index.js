import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import dashboardReducer from './dashboardSlice';
import transactionReducer from './transactionSlice';
import categoryReducer from './categorySlice';
import budgetReducer from './budgetSlice';
import goalReducer from './goalSlice';
import analyticsReducer from './analyticsSlice';
import reportReducer from './reportSlice';
import notificationReducer from './notificationSlice';
import reportScheduleReducer from './reportScheduleSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
  budgets: budgetReducer,
  goals: goalReducer,
  analytics: analyticsReducer,
  reports: reportReducer,
  notifications: notificationReducer,
  schedules: reportScheduleReducer,
});

export default rootReducer;
