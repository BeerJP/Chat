import { React, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setName, setType, setAuth, setToken } from '../hooks/userSlice.js'
import { getToken } from '../api/apiFunctions.js';
import Box from '@mui/material/Box';
import Loginbox from "../components/loginbox/loginbox.js";


function Authpage() {
    
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (token) {
            getToken(token).then(response => {
                dispatch(setName(response.user));
                dispatch(setAuth(true));
                window.location = '/chatroom';
            }).catch(error => {
                dispatch(setName(''));
                dispatch(setAuth(false));
                dispatch(setToken(''));
            });
        };
    },[token, dispatch]);

    return (
        <>
            <Box sx={{  height: '100vh', width: 'auto', borderRadius: 1, margin: 0, display: "flex", justifyContent: 'center', alignItems: 'center', }} >
                <Box sx={{ width: 350, height: 300, borderRadius: 1, background: 'rgba(0, 0, 0, 0.2)', display: "flex", justifyContent: 'center', alignItems: 'center', }}>
                    <Loginbox/>
                </Box>
            </Box>
        </>
     );
};

export default Authpage;