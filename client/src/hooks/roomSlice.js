import { createSlice } from '@reduxjs/toolkit'


const roomSlice = createSlice({
    name: 'room',
    initialState: {
        name: 'main',
    },
    reducers: {
        setRoom: (state, action) => {
            state.name = action.payload;
        },
    }
})

export const { setRoom } = roomSlice.actions;
export default roomSlice.reducer;