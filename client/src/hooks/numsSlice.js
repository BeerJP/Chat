import { createSlice } from '@reduxjs/toolkit'


const numsSlice = createSlice({
    name: 'nums',
    initialState: {
        online: 0,
    },
    reducers: {
        setOnline: (state, action) => {
            state.online = action.payload;
        },
    }
})

export const { setOnline } = numsSlice.actions;
export default numsSlice.reducer;