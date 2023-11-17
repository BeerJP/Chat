import { React, Fragment, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Textbox from "../components/textbox";
import Listbox from "../components/listbox";
import Inputbox from "../components/inputbox";
import { webSocket } from '../api/webSocket.js';


function Chatpage() {

    const [isWebsocket, setWebsocket] = useState(null);
    const [isMessage, setMessage] = useState([]);

    useEffect(() => {
        const ws = webSocket();
        ws.onopen = () => {
            setWebsocket(ws);
        };
        ws.onclose = () => {
            setWebsocket(null);
        };
        ws.onmessage = (event) => {
            setMessage(JSON.parse(event.data));
        };
        return () => {
            if (isWebsocket) {
                isWebsocket.close();
                setWebsocket(null);
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (isWebsocket && isWebsocket.readyState === WebSocket.OPEN) {
            isWebsocket.send(message);
        }
    };

    return ( 
        <>
            <Fragment>
                <Container maxWidth="md">
                    <Box sx={{ 
                            height: '95vh', 
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} >
                            <Box m={1} sx={{
                                    boxShadow: 3,
                                    height: 500,
                                    width: '100%',
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 0.2,
                                    gridTemplateRows: '1fr',
                                    gridTemplateAreas: 
                                    `
                                        "main main main sidebar"
                                        "footer footer footer footer"
                                    `
                                }}>
                                <Box sx={{ gridArea: 'main' }}>
                                    <Textbox message={isMessage}/>
                                </Box>
                                <Box sx={{ gridArea: 'sidebar' }}>
                                    <Listbox/>
                                </Box>
                                <Box sx={{ gridArea: 'footer' }}>
                                    <Inputbox sendMessage={sendMessage}/>
                                </Box>
                            </Box>
                    </Box>
                </Container>
            </Fragment>
        </>
     );
}

export default Chatpage;