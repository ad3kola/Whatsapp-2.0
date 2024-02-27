import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import IDSlice from "@/redux/features/IDSlice";
import type { TypedUseSelectorHook } from "react-redux";
import SidebarSlice from "./features/SidebarSlice";
export const store = configureStore({
  reducer: {
    IDSlice, 
    SidebarSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;