import { createSlice } from '@reduxjs/toolkit'


const roomSlice = createSlice({
    name: 'room',
    initialState: {
        name: 'main',
        online: 0,
    },
    reducers: {
        setRoom: (state, action) => {
            state.name = action.payload;
        },

        setOnline: (state, action) => {
            state.online = action.payload;
        },
    }
})

export const { setRoom, setOnline } = roomSlice.actions;
export default roomSlice.reducer;