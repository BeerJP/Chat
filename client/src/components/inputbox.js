import { React, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Send from "../assets/send.png"


function Inputbox({ sendMessage }) {

    const [isText, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const sendPayload = () => {
        const payload = {
            "name": "Beer",
            "text": isText,
        }
        const jsonString = JSON.stringify(payload);
        sendMessage(jsonString);
        setText('');
    }

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            sendPayload();
        }
    }

    return (
        <>
            <Card sx={{ 
                    height: 80,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& .MuiTextField-root': { 
                        m: 1, 
                        width: '98%',
                    },
                    background: 'rgba(0, 0, 0, 0.7)',
                }}>
                <TextField
                id="outlined-basic"
                variant="outlined"
                autoFocus
                placeholder="Message..."
                value={isText}
                onChange={handleChange}
                onKeyDown={handleEnter}
                sx={{
                    input: { color: 'white', fontSize: 14, },
                }}
                />
                <Button variant="outlined" onClick={sendPayload} sx={{ 
                        m: 1, 
                        borderRadius: 50, 
                        height: 62,
                    }}>
                    <Avatar sx={{ width: 30, height: 30 }} src={Send}/>
                </Button>
            </Card>
        </>
     );
};

export default Inputbox;