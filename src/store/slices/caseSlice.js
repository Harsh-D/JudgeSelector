import { createSlice } from '@reduxjs/toolkit';

const defaultCases = [
  { name: "Case 1", categoryCode: "01", subCategoryCode: "0101",  subject: "Direct Tax Matters" },
  { name: "Case 2", categoryCode: "02", subCategoryCode: "0201",  subject: "Indirect Tax Matters" },
  { name: "Case 3", categoryCode: "03", subCategoryCode: "0301",  subject: "Service Matters" },
  { name: "Case 4", categoryCode: "04", subCategoryCode: "0401",  subject: "Election Matters" },
  { name: "Case 5", categoryCode: "05", subCategoryCode: "0501",  subject: "Criminal Matters" },
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
