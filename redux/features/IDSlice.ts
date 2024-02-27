import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IDStateProps {
  value: { id: string };
}

const initialState: IDStateProps = {
  value: { id: "" },
// };
}

const IDSlice = createSlice({
  name: "ID",
  initialState,
  reducers: {
    updateChatID: (state, action: PayloadAction<string>) => {
      state.value.id = action.payload;
    },
  },
});

export const { updateChatID } = IDSlice.actions;
export default IDSlice.reducer;
