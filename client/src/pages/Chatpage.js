import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setName, setType, setAuth, setToken } from '../hooks/userSlice.js'
import { getToken } from '../api/apiFunctions.js';
import { webSocket } from '../api/webSocket.js';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Inputbox from "../components/inputbox/inputbox.js";
import Listbox from "../components/listbox/listbox.js";
import Textbox from "../components/textbox/textbox.js";


function Chatpage() {

    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    const [isSelected, setSelected] = useState('main')
    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([{}]);
    const [isToken, setTokens] = useState();
    const [isUser, setUsers] = useState('');

    useEffect(() => {
        if (isUser === '') {
            return
        }
        const wsc = webSocket("main", isUser);
        wsc.onopen = () => {
            setWebsocket(wsc);
        };
        wsc.onclose = () => {
            setWebsocket(null);
        };
        wsc.onmessage = (event) => {
            if(event.data) {
                var response = JSON.parse(event.data);
                setMessage(response);
            }
        };
        return () => {
            if (isWebsocket) {
                isWebsocket.close();
                setWebsocket(null);
            }
        };
    }, [isUser]);

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
            }).catch(error => {
                dispatch(setName(''));
                dispatch(setAuth(false));
                dispatch(setToken(''));
                window.location = '/';
            });
        };
    },[token, dispatch]);

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
                        <Textbox isMessage={isMessage} isToken={isToken} isUser={isUser} isSelected={isSelected} />
                    </Box>
                    <Box sx={{ gridArea: 'rightbar' }}>
                        <Listbox isToken={isToken} isUser={isUser} isSelected={isSelected} setSelected={setSelected}/>
                    </Box>
                    <Box sx={{ gridArea: 'footer' }}>
                        <Inputbox sendMessage={sendMessage} isUser={isUser} isSelected={isSelected} />
                    </Box>
                </Box>
            </Box>
        </Grow>
    );
}

export default Chatpage;
