import { React, useState } from "react";
import { postToken } from '../../api/apiFunctions.js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';


function Guest({ handleCard }) {

    const [isName, setName] = useState('');

    const submitUser = () => {
        if (isName) {
            const payload = {
                "user": "Guest " + isName,
            };
            postToken(payload).then(response => {
                localStorage.setItem('token', response.token);
                window.location = '/chatroom';
            });
        };
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            submitUser();
        };
    };

    const handleChange = (event) => {
        if (event.target.type ===  'text') {
            setName(event.target.value);
        }
    };

    return (
        <>
            <Stack direction="column" spacing={2} sx={{ width: '90%', mt: 2 }}>
                <TextField
                    id="outlined"
                    label="Name"
                    color="primary"
                    focused
                    value={isName}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    inputProps={{ maxLength: 8 }}
                    sx={{
                        input: {height: 50, color: 'white', fontSize: 24, textAlign: 'center' },
                    }}
                    />
                <Button onClick={submitUser} sx={{ 
                        height: 50, 
                        color: 'white', 
                        fontSize: 16,
                        fontWeight: 'bold',
                        letterSpacing: 2,
                    }}>
                    <span>Connect</span>
                </Button>
                <Button onClick={() => handleCard("member")} sx={{ 
                        height: 20, 
                        color: 'white', 
                        fontSize: 10,
                    }}>
                    <span>User Login</span>
                </Button>
            </Stack>
        </>
     );
};

export default Guest;