import { createSlice } from '@reduxjs/toolkit'


const roomSlice = createSlice({
    name: 'room',
    initialState: {
        name: 'main',
        wsc: '',
    },
    reducers: {
        setRoom: (state, action) => {
            state.name = action.payload;
        },

        setWsc: (state, action) => {
            state.name = action.payload;
        },
    }
})

export const { setRoom, setWsc } = roomSlice.actions;
export default roomSlice.reducer;