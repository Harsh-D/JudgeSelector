import { configureStore } from '@reduxjs/toolkit';
import assignedJudgeReducer from './slices/assignedJudgeSlice';
import caseReducer from './slices/caseSlice';
import judgesReducer from '../store/slices/judgesSlice';

export const store = configureStore({
  reducer: {
    assignedJudge: assignedJudgeReducer,
    cases: caseReducer,
    judges: judgesReducer,
  },
});
