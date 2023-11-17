import { React, useMemo, useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { fetchData } from '../api/apiFunctions.js';


function Textbox({ message }) {

    const [isChat, setChat] = useState([]);

    useEffect(() => {
        fetchData().then(data => {
            setChat(data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        try {
            setChat(prevChat => prevChat.concat(message));
          } catch (error) {
            console.error('Invalid JSON data:', error);
          }
    }, [message]);

    const renderedText = useMemo(() => {
        return isChat.map((item, index) => (
            <Typography key={index} sx={{ fontSize: 14 }} color="black">
                {item.createdAt} : {item.name} : {item.text}
            </Typography>
        ));
    }, [isChat]);

    return (
        <>
            <Card sx={{ width: '100%', height: '100%', overflowY: 'scroll',
                }}>
                <CardContent>
                    {renderedText}
                </CardContent>
            </Card>
        </>
     );
};

export default Textbox;