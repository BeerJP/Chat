import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import roomSlice from './roomSlice';
import numsSlice from './numsSlice';

export default configureStore({
    reducer: {
        user: userSlice,
        room: roomSlice,
        nums: numsSlice,
    },
});