import { React, useState } from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';


function Inputbox({ sendMessage }) {

    const [isText, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            const payload = {
                "name": "Beer",
                "text": isText,
            }
            const jsonString = JSON.stringify(payload);
            sendMessage(jsonString);
            setText('');
        }
    }

    return (
        <>
            <Card sx={{ 
                    height: 80, 
                    width: '100%',
                    '& .MuiTextField-root': { 
                        m: 1, 
                        width: '98%',
                    },
                }}>
                <TextField
                id="outlined-basic"
                variant="outlined"
                autoFocus
                placeholder="Message..."
                value={isText}
                onChange={handleChange}
                onKeyDown={handleEnter}
                />
            </Card>
        </>
     );
};

export default Inputbox;