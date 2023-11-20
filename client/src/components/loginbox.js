import { React, useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { postToken } from '../api/apiFunctions.js';


function Loginbox() {

    const [isName, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    };

        const submitUser = () => {
            if (isName) {
                const payload = {
                    "user": isName,
                };
                postToken(payload).then(response => {
                    localStorage.setItem('token', response.token);
                    window.location = `/chatroom`;
                });
            };
        }

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            submitUser();
        }
    }

    return (
        <>
            <Stack direction="column" spacing={2}>
                <TextField
                    id="outlined"
                    label="Name"
                    color="primary"
                    focused
                    value={isName}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    sx={{
                        input: { color: 'white', fontSize: 24, textAlign: 'center' },
                    }}
                    />
                <Button onClick={submitUser} sx={{ 
                        height: 50, 
                        color: 'white', 
                        fontSize: 16,
                        fontWeight: 'bold',
                        letterSpacing: 3,
                    }}>
                    <span>Join</span>
                </Button>
            </Stack>
        </>
     );
};

export default Loginbox;