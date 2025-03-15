import { createSlice } from '@reduxjs/toolkit';

const defaultCases = [
  { name: "Case 1", details: "Details of Case 1", subject: "Direct Tax Matters" },
  { name: "Case 2", details: "Details of Case 2", subject: "Indirect Tax Matters" },
  { name: "Case 3", details: "Details of Case 3", subject: "Service Matters" },
  { name: "Case 4", details: "Details of Case 4", subject: "Election Matters" },
  { name: "Case 5", details: "Details of Case 5", subject: "Criminal Matters" },
];

export const caseSlice = createSlice({
  name: 'cases',
  initialState: {
    value: defaultCases,
  },
  reducers: {
    addCase: (state, action) => {
      state.value?.push(action.payload);
    },
  }, 
});

export const { addCase } = caseSlice.actions;

export default caseSlice.reducer;
