import { createSlice } from '@reduxjs/toolkit';

export const assignedJudgeSlice = createSlice({
  name: 'assignedJudge',
  initialState: {
    value: null,
  },
  reducers: {
    setAssignedJudge: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setAssignedJudge } = assignedJudgeSlice.actions;

export default assignedJudgeSlice.reducer;
