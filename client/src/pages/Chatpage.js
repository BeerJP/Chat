import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setName, setType, setAuth } from '../hooks/userSlice.js'
import { getToken } from '../api/apiFunctions.js';
import { webSocket } from '../api/webSocket.js';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Inputbox from "../components/inputbox/inputbox.js";
import Listbox from "../components/listbox/listbox.js";
import Roombox from "../components/textbox/roombox.js";
import Userbox from "../components/textbox/userbox.js";


function Chatpage() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.name);
    const room = useSelector((state) => state.room.name);
    const token = localStorage.getItem('token');

    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([{}]);

    useEffect(() => {
        const wsc = webSocket("main", user);
        wsc.onopen = () => {
            setWebsocket(wsc);
        };
        wsc.onclose = () => {
            setWebsocket(null);
        };
        wsc.onmessage = (event) => {
            if(event.data) {
                const response = JSON.parse(event.data);
                setMessage(response);
            }
        };
        return () => {
            if (isWebsocket) {
                isWebsocket.close();
                setWebsocket(null);
            }
        };
    }, [user]);

    const sendMessage = (message) => {
        if (isWebsocket.readyState === WebSocket.OPEN) {
            isWebsocket.send(message);
        }
    };

    useEffect(() => {
        if (token) {
            getToken(token).then(response => {
                dispatch(setName(response.user));
                dispatch(setAuth(true));
                if (response.user.substring(0, 5) !== "Guest") {
                    dispatch(setType(true));
                }
            }).catch(error => {
                dispatch(setName(''));
                dispatch(setType(false));
                dispatch(setAuth(false));
                localStorage.removeItem('token');
                window.location = '/';
            });
        } else {
            window.location = '/';
        }
    },[token]);

    return (
        <Grow in={true} timeout={500} style={{ transformOrigin: '1 1 1' }}>
            <Box sx={{ height: '100vh', width: 'auto', borderRadius: 1, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Box m={1} sx={{ boxShadow: 3, height:'80%', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.2, gridTemplateRows: '1fr',
                        gridTemplateAreas: {
                            xs: `
                                "main main main rightbar" "footer footer footer rightbar"
                            `,
                            sm: `
                                "main main main rightbar" "footer footer footer rightbar"
                            `,
                            lg: `
                                "main main main rightbar" "footer footer footer rightbar"
                            `,
                        },}}>
                    <Box sx={{ gridArea: 'main' }}>
                        {
                            room === 'main' ? <Roombox isMessage={isMessage}/> : <Userbox/>
                        }
                    </Box>
                    <Box sx={{ gridArea: 'rightbar' }}>
                        <Listbox/>
                    </Box>
                    <Box sx={{ gridArea: 'footer' }}>
                        <Inputbox/>
                    </Box>
                </Box>
            </Box>
        </Grow>
    );
}

export default Chatpage;
