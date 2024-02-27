import { createSlice } from "@reduxjs/toolkit";

type InitialStateProps = {
	value: {
		openSidebar: boolean,
	}
}


const initialState: InitialStateProps = {
	value: {
		openSidebar: false,
	}
}

const sidebarslice = createSlice({
	name: 'sidebar',
	initialState,
	reducers: {
		OpenSidebar: (state) => {
			state.value.openSidebar = true;
		},
		CloseSidebar: () => {
			return initialState;
		}
	}
}) 

export const { OpenSidebar, CloseSidebar } = sidebarslice.actions;
export default sidebarslice.reducer;