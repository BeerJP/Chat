import { React, useEffect } from "react";
import { getToken } from '../api/apiFunctions.js';
import Box from '@mui/material/Box';
import Loginbox from "../components/loginbox/loginbox.js";


function Authpage() {
    
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            getToken(token).then(response => {
                window.location = '/chatroom';
            }).catch(error => {
                localStorage.removeItem('token');
            });
        };
    },[token]);

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