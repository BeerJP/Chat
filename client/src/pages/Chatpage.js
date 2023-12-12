import { React, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Inputbox from "../features/inputbox.js";
import Listbox from "../features/listbox.js";
import Textbox from "../features/textbox.js";
import { webSocket } from '../api/webSocket.js';
import { getToken } from '../api/apiFunctions.js';


function Chatpage() {

    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([{}]);
    const [isToken, setToken] = useState();
    const [isUser, setUser] = useState('');

    useEffect(() => {
        if (isUser !== '') {
            const ws = webSocket("main", isUser);
            ws.onopen = () => {
                setWebsocket(ws);
            };
            ws.onclose = () => {
                setWebsocket(null);
            };
            ws.onmessage = (event) => {
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
        }
    }, [isUser]);

    const sendMessage = (message) => {
        if (isWebsocket && isWebsocket.readyState === WebSocket.OPEN) {
            isWebsocket.send(message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location = '/';
            return;
        }
        getToken(token)
            .then(response => {
                setToken(token);
                setUser(response.user);
            })
            .catch(error => {
                console.error(error);
                window.location = '/';
            });
    }, []);

    return (
        <Grow in={true} timeout={500} style={{ transformOrigin: '1 1 1' }}>
            <Box sx={{
                    height: '100vh',
                    width: 'auto',
                    borderRadius: 1,
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Box m={1} sx={{
                        boxShadow: 3,
                        height:'80%',
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 0.2,
                        gridTemplateRows: '1fr',
                        gridTemplateAreas: {
                            xs: `
                                "main main main rightbar"
                                "footer footer footer rightbar"
                            `,
                            sm: `
                                "main main main rightbar"
                                "footer footer footer rightbar"
                            `,
                            lg: `
                                "main main main rightbar"
                                "footer footer footer rightbar"
                            `,
                        },}}>
                    <Box sx={{ gridArea: 'main' }}>
                        <Textbox message={isMessage} token={isToken} />
                    </Box>
                    <Box sx={{ gridArea: 'rightbar' }}>
                        <Listbox isToken={isToken} isUser={isUser}/>
                    </Box>
                    <Box sx={{ gridArea: 'footer' }}>
                        <Inputbox sendMessage={sendMessage} isUser={isUser} />
                    </Box>
                </Box>
            </Box>
        </Grow>
    );
}

export default Chatpage;
