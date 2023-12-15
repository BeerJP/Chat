import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setName, setType, setAuth, setToken } from '../hooks/userSlice.js'
import { setOnline } from '../hooks/numsSlice.js'
import { getToken } from '../api/apiFunctions.js';
import { webSocket } from '../api/webSocket.js';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Inputbox from "../components/inputbox/inputbox.js";
import Listbox from "../components/listbox/listbox.js";
import Textbox from "../components/textbox/textbox.js";


function Chatpage() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.name);
    const type = useSelector((state) => state.user.type);
    const token = localStorage.getItem('token');

    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([{}]);

    useEffect(() => {
        if (!token) {
            return;
        };
        const wsc = webSocket(type, user);
        wsc.onopen = () => {
            setWebsocket(wsc);
        };
        wsc.onclose = () => {
            setWebsocket(null);
        };
        wsc.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.text) {
                setMessage(response);
            } else {
                dispatch(setOnline(response.member))
            }
        };
    }, [type, user, token, dispatch]);

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
                dispatch(setToken(token));
                if (response.type === "1") {
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
    },[token, dispatch]);

    return (
        <Grow in={true} timeout={500} style={{ transformOrigin: '1 1 1' }}>
            <Box sx={{ height: '100vh', width: 'auto', borderRadius: 1, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Box m={1} sx={{ boxShadow: 3, height: 'auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.2, gridTemplateRows: '1fr',
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
                        <Textbox isMessage={isMessage} token={token}/> 
                    </Box>
                    <Box sx={{ gridArea: 'rightbar' }}>
                        <Listbox/>
                    </Box>
                    <Box sx={{ gridArea: 'footer' }}>
                        <Inputbox sendMessage={sendMessage}/>
                    </Box>
                </Box>
            </Box>
        </Grow>
    );
}

export default Chatpage;
