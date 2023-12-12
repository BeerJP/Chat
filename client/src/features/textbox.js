import { React, useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import { getMessages } from '../api/apiFunctions.js';


function Textbox({ message, token }) {

    const [showAllMessages, setShowAllMessages] = useState(false);
    const [isScroll, setScroll] = useState(true);
    const [chatMessages, setChatMessages] = useState([{}]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatMessages.length > 0) {
            scrollToBottom();
        }
        setScroll(true);
    }, [chatMessages]);

    useEffect(() => {
        if (token) {
            getMessages(token, "10").then(response => {
                if (response) {
                    setChatMessages(response.reverse());
                    if (response.length < 20) {
                        setShowAllMessages(false)
                    } else {
                        setShowAllMessages(true)
                    }
                }
            }).catch(error => {
                console.error(error);
            });
        };
    }, [token]);

    useEffect(() => {
        if (message) {
            setChatMessages(prevChat => prevChat.concat(message));
        }
    }, [message]);

    const scrollToBottom = () => {
        if (!isScroll) {
            return;
        }
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
        }
    };

    const handleShowAllMessages = () => {
        setScroll(false);
        if (token) {
            getMessages(token, "all").then(response => {
                if (response) {
                    setChatMessages(response);
                    setShowAllMessages(false);
                }
            }).catch(error => {
                console.error(error);
            });
        };
    }

    return (
        <Card sx={{ width: '100%', height: '100%', overflowY: 'scroll', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div ref={chatContainerRef}>
                {
                    showAllMessages ? 
                    <CardContent sx={{ mx: 1, mb: 0}}>
                        <Typography color="lightgrey" sx={{ 
                                mb: 1, 
                                display: 'flex', 
                                justifyContent: 'center',
                                height: 20
                            }}>
                            <Button onClick={handleShowAllMessages} variant="text" sx={{ fontSize: 10, width: '100%' }}>
                                <span>All Messages</span>
                            </Button>
                        </Typography>
                    </CardContent>
                    :
                    <></>
                }
                {
                    chatMessages[0].text && chatMessages.map((item, index) => (
                        <div key={index}>
                            <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
                                <CardContent sx={{ mx: 1, mb: 0}}>
                                    <Typography color="lightgrey" sx={{ 
                                            fontSize: 10, 
                                            mb: 1, 
                                            display: 'flex', 
                                            justifyContent: 'space-between' 
                                        }}>
                                        <span>{item.name}</span>
                                        <span>{item.time} : {item.date}</span>
                                    </Typography>
                                    <Typography color="white" sx={{ 
                                            fontSize: 14, 
                                            width: '85%', 
                                            wordWrap: 'break-word',
                                            mb: 0,
                                        }}>
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

export default Textbox;
