import { React, useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { postToken, loginUser } from '../../api/apiFunctions.js';


function Member({ handleCard }) {

    const [isName, setName] = useState('');
    const [isPass, setPass] = useState('');

    const handleChange = (event) => {
        if (event.target.type ===  'text') {
            setName(event.target.value);
        }
        if (event.target.type ===  'password') {
            setPass(event.target.value);
        }
    };

    const submitUser = () => {
        if (isName && isPass) {
            const payload = {
                "user": isName,
                "pass": isPass,
            };
            loginUser(payload).then(reponse => {
                postToken({
                    "user": reponse
                }).then(response => {
                    localStorage.setItem('token', response.token);
                });
            })
        };
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            submitUser();
        };
    };

    return (
        <>
            <Stack direction="column" spacing={2} sx={{ width: '90%'}}>
                <TextField
                    id="outlined username"
                    label="Username"
                    color="primary"
                    focused
                    value={isName}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    inputProps={{ maxLength: 8 }}
                    sx={{
                        input: { height: 10, color: 'white', fontSize: 16, textAlign: 'center' },
                    }}
                    />
                <TextField
                    id="outlined password1"
                    label="Password"
                    type="password"
                    color="primary"
                    focused
                    value={isPass}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                    inputProps={{ maxLength: 8 }}
                    sx={{
                        input: { height: 10, color: 'white', fontSize: 16, textAlign: 'center' },
                    }}
                    />
                <Button onClick={submitUser} sx={{ 
                        height: 50, 
                        color: 'white', 
                        fontSize: 16,
                        fontWeight: 'bold',
                        letterSpacing: 2,
                    }}>
                    <span>Login</span>
                </Button>
                <div>
                    <Button onClick={() => handleCard("guest")} sx={{ 
                            height: 20,
                            width: 155, 
                            color: 'white', 
                            fontSize: 10,
                        }}>
                        <span>Guest Connect</span>
                    </Button>
                    <Button onClick={() => handleCard("register")} sx={{ 
                            height: 20, 
                            width: 155,
                            color: 'white', 
                            fontSize: 10,
                        }}>
                        <span>Register</span>
                    </Button>
                </div>
            </Stack>
        </>
     );
};

export default Member;