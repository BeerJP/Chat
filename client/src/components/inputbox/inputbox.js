import { React, useState } from "react";
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Send from "../../assets/send.png"


function Inputbox({ sendMessage }) {

    const user = useSelector((state) => state.user.name);
    const room = useSelector((state) => state.room.name);

    const [isText, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const sendPayload = () => {
        if (!isText){
            return
        }
        const payload = {
            "name": user,
            "text": isText,
            "target": room,
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
            <Card sx={{ height: 80, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.7)',
                    '& .MuiTextField-root': { 
                        m: 1, 
                        width: '98%',
                    },
                }}>
                <TextField id="outlined-basic" variant="outlined" placeholder="Message..." value={isText} onChange={handleChange} onKeyDown={handleEnter}
                    sx={{
                        input: { color: 'white', fontSize: 14, },
                        wordWrap: 'break-word'
                    }}/>
                <Button onClick={sendPayload} sx={{ m: 1, borderRadius: 50, height: 62, }}>
                    <Avatar sx={{ width: 30, height: 30 }} src={Send}/>
                </Button>
            </Card>
        </>
     );
};

export default Inputbox;