import { React, useState, useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import { fetchData } from '../api/apiFunctions.js';


function Textbox({ message }) {

    const [isChat, setChat] = useState([]);
    const [isKeys, setKeys] = useState(0);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        fetchData().then(response => {
            if (response) {
                setChat(response);
                scrollToBottom();
            }
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        try {
            setChat(prevChat => prevChat.concat(message));
            setKeys(prevKeys => prevKeys + 1);
        } catch (error) {
            console.error('Invalid JSON data:', error);
        }
    }, [message]);

    useEffect(() => {
        scrollToBottom();
    }, [isKeys]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    return (
        <Card sx={{ width: '100%', height: 420, overflowY: 'scroll', background: 'rgba(0, 0, 0, 0.7)' }}>
            <div ref={chatContainerRef}>
                {isChat.map((item, index) => (
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
