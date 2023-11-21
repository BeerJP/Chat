import { React, useEffect } from "react";
import Box from '@mui/material/Box';
import Loginbox from "../components/loginbox";
import { getToken } from '../api/apiFunctions.js';


function Authpage({ user }) {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getToken(token).then(() => {
                window.location = '/chatroom';
            }).catch(error => {
                localStorage.removeItem('token');
                return;
            })
        }
    })

    return ( 
        <>
            <Box sx={{ 
                    height: '100vh',
                    width: 'auto',
                    borderRadius: 1,
                    margin: 0,
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                }} >
                <Box sx={{
                        width: 350,
                        height: 220,
                        borderRadius: 1,
                        background: 'rgba(0, 0, 0, 0.2)',
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Loginbox user={user}/>
                </Box>
            </Box>
        </>
     );
};

export default Authpage;