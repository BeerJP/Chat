import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        type: false,
        auth: false,
        token: '',
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },

        setType: (state, action) => {
            state.type = action.payload;
        },

        setAuth: (state, action) => {
            state.auth = action.payload;
        },

        setToken: (state, action) => {
            state.token = action.payload;
        },
    }
})

export const { setName, setType, setAuth, setToken } = userSlice.actions;
export default userSlice.reducer;