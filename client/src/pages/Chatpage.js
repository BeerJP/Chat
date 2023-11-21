import { React, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Inputbox from "../components/inputbox";
import Listbox from "../components/listbox";
import Textbox from "../components/textbox";
import { webSocket } from '../api/webSocket.js';
import { getToken } from '../api/apiFunctions.js';


function Chatpage() {
    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([{}]);
    const [isMember, setMember] = useState([{state: ''}]);
    const [isToken, setToken] = useState();
    const [isUser, setUser] = useState('');

    useEffect(() => {
        if (isUser !== '') {
            const ws = webSocket(isUser);
            ws.onopen = () => {
                setWebsocket(ws);
            };
            ws.onclose = () => {
                setWebsocket(null);
            };
            ws.onmessage = (event) => {
                if(event.data) {
                    var response = JSON.parse(event.data);
                    if (response.hasOwnProperty('state')) {
                        setMember(response);
                    } else {
                        setMessage(response);
                    }
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
            <Box
                sx={{
                    height: '100vh',
                    width: 'auto',
                    borderRadius: 1,
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    m={1}
                    sx={{
                        boxShadow: 3,
                        height: 500,
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 0.2,
                        gridTemplateRows: '1fr',
                        gridTemplateAreas: {
                            xs: `
                                "main main main main"
                                "footer footer footer footer"
                            `,
                            sm: `
                                "main main main sidebar"
                                "footer footer footer footer"
                            `,
                            lg: `
                                "main main main sidebar"
                                "footer footer footer footer"
                            `,
                        },
                    }}
                >
                    <Box sx={{ gridArea: 'main' }}>
                        <Textbox message={isMessage} token={isToken} />
                    </Box>
                    <Box sx={{ gridArea: 'sidebar' }}>
                        <Listbox member={isMember} token={isToken}/>
                    </Box>
                    <Box sx={{ gridArea: 'footer' }}>
                        <Inputbox sendMessage={sendMessage} user={isUser} />
                    </Box>
                </Box>
            </Box>
        </Grow>
    );
}

export default Chatpage;
