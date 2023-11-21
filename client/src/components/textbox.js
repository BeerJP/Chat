import { React, useState, useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import { getMessages } from '../api/apiFunctions.js';


function Textbox({ message, token }) {

    const [isChat, setChat] = useState([{}]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (token) {
            getMessages(token).then(response => {
                if (response) {
                    setChat(response);
                }
            }).catch(error => {
                console.error(error);
            });
        };
    }, [token]);

    useEffect(() => {
        try {
            setChat(prevChat => prevChat.concat(message));
        } catch (error) {
            console.error('Invalid JSON data:', error);
        }
    }, [message]);

    useEffect(() => {
        scrollToBottom();
    }, [isChat]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
        }
    };

    return (
        <Card sx={{ width: '100%', height: 420, overflowY: 'scroll', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div ref={chatContainerRef}>
                {isChat && isChat.map((item, index) => (
                    <div key={index}>
                        <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
                            <CardContent sx={{ mx: 1 }}>
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
                                        wordWrap: 'break-word' 
                                    }}>
                                    <span>{item.text}</span>
                                </Typography>
                            </CardContent>
                        </Grow>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Textbox;
