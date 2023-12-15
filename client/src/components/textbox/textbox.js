import { React, useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from 'react-redux'
import { getMessages } from '../../api/apiFunctions.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';


function Textbox({ isMessage, token }) {

    const user = useSelector((state) => state.user.name);
    const auth = useSelector((state) => state.user.auth);
    const room = useSelector((state) => state.room.name);

    const [isScroll, setScroll] = useState(true);
    const [chatMessages, setChatMessages] = useState([{}]);
    const containerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (!isScroll) {
            return;
        };
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
        };
    }, [isScroll]);

    useEffect(() => {
        if (chatMessages.length > 0) {
            scrollToBottom();
        }
        setScroll(true);
    }, [chatMessages, scrollToBottom]);

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
    }, [token, user, auth, room]);

    useEffect(() => {
        if (isMessage && isMessage.target === room) {
            setChatMessages(prevChat => prevChat.concat(isMessage));
        };
    }, [isMessage, room]);

    return (
        <Card sx={{ width: '100%', height: 500, background: 'rgba(0, 0, 0, 0.7)' }}>
            <CardContent sx={{ mx: 1, mb: 0, height: 'auto' }}>
                <Typography borderBottom={1} color="lightgrey" sx={{ fontSize: 10, mb: 1, display: 'flex', justifyContent: 'right' }}>
                    <span>{room}</span>
                </Typography>
            </CardContent>
            <Card sx={{ overflowY: 'scroll', width: '100%', height: 445, background: 'rgba(0, 0, 0, 0)' }}>
                <div ref={containerRef}>
                    {
                        chatMessages[0].text && chatMessages.map((item, index) => (
                            <div key={index}>
                                <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
                                    <CardContent sx={{ mx: 1, mb: -2.5}}>
                                        <Typography color="lightgrey" sx={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', px: 1 }}>
                                            <span style={{ width: 50, textAlign: 'left' }}>{item.name !== user ? item.name : ''}</span>
                                            {
                                                index !== 0 && chatMessages[index-1].time === item.time ? <></>
                                                :
                                                <span>{item.time} : {item.date}</span>
                                            }
                                            <span style={{ width: 50, textAlign: 'right' }}>{item.name === user ? item.name : ''}</span>
                                        </Typography>
                                        <Typography justifyContent={item.name === user ? "right" : ""} color="white" sx={{ display: 'flex' }}>
                                            <Typography sx={{ fontSize: 14, wordWrap: 'break-word', borderRadius: 1.5, py :1, px: 2, background: 'rgba(0, 0, 0, 0.2)' }}>
                                                <span>{item.text}</span>
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                </Grow>
                            </div>
                        ))
                    }
                </div>
            </Card>
        </Card>
    );
};

export default Textbox;
