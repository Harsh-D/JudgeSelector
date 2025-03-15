import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const judgesSlice = createSlice({
  name: 'judges',
  initialState,
  reducers: {
    setJudges: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setJudges } = judgesSlice.actions;
export default judgesSlice.reducer;
