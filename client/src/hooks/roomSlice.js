import { createSlice } from '@reduxjs/toolkit'


const roomSlice = createSlice({
    name: 'room',
    initialState: {
        name: 'main',
        online: 0,
        notification: {},
    },
    reducers: {
        setRoom: (state, action) => {
            state.name = action.payload;
        },

        setOnline: (state, action) => {
            state.online = action.payload;
        },

        setNotification: (state, action) => {
            const type = action.payload.type;
            const payload = action.payload.payload;
            switch (type) {
                case "INSERT":
                    state.notification[payload] = 1;
                    break;
                default:
                    state.notification[payload] = 0;
                    break;
            }
        },
    }
})

export const { setRoom, setOnline, setNotification } = roomSlice.actions;
export default roomSlice.reducer;