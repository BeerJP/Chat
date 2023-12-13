import { React, useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux'
import { getMessages } from '../../api/apiFunctions.js';
import { directSocket } from '../../api/webSocket.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';


function Userbox() {

    const user = useSelector((state) => state.user.name);
    const auth = useSelector((state) => state.user.auth);
    const room = useSelector((state) => state.room.name);
    const token = localStorage.getItem('token');

    const [isScroll, setScroll] = useState(true);
    const [chatMessages, setChatMessages] = useState([{}]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (chatMessages.length > 0) {
            scrollToBottom();
        }
        setScroll(true);
    }, [chatMessages]);

    useEffect(() => {
        if (token && user && auth) {
            getMessages(token, room, user).then(response => {
                if (response) {
                    setChatMessages(response);
                };
            }).catch(error => {
                console.error(error);
            });
        };
    }, [token, user, auth]);

//    useEffect(() => {
//        if (isMessage) {
//            setChatMessages(prevChat => prevChat.concat(isMessage));
//        };
//    }, [isMessage]);

    const scrollToBottom = () => {
        if (!isScroll) {
            return;
        }
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
        }
    };

    return (
        <Card sx={{ width: '100%', height: '100%', overflowY: 'scroll', background: 'rgba(0, 0, 0, 0.7)' }}>
            <CardContent sx={{ mx: 1, mb: 0}}>
                <Typography borderBottom={1} color="lightgrey" sx={{ fontSize: 10, mb: 1, display: 'flex', justifyContent: 'right' }}>
                    <span>{room}</span>
                </Typography>
            </CardContent>
            <div ref={containerRef}>
                {
                    chatMessages[0].text && chatMessages.map((item, index) => (
                        <div key={index}>
                            <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
                                <CardContent sx={{ mx: 1, mb: 0}}>
                                    <Typography color="lightgrey" sx={{ fontSize: 10, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.name}</span>
                                        <span>{item.time} : {item.date}</span>
                                    </Typography>
                                    <Typography color="white" sx={{ fontSize: 14, width: '85%', wordWrap: 'break-word', mb: 0, }}>
                                        <span>{item.text}</span>
                                    </Typography>
                                </CardContent>
                            </Grow>
                        </div>
                    ))
                }
            </div>
        </Card>
    );
};

export default Userbox;
