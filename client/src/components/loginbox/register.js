import { React, useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { regisUser } from '../../api/apiFunctions.js';


function Register({ handleCard }) {

    const [isName, setName] = useState('');
    const [isPass1, setPass1] = useState('');
    const [isPass2, setPass2] = useState('');

    const handleChange = (event) => {
        if (event.target.type ===  'text') {
            setName(event.target.value);
        }
        if (event.target.id ===  'outlined password1') {
            setPass1(event.target.value);
        }
        if (event.target.id ===  'outlined password2') {
            setPass2(event.target.value);
        };
    };

    const registerUser = () => {
        if (isName && isPass1 && isPass2) {
            if (isPass1 === isPass2) {
                const payload = {
                    "user": isName,
                    "pass": isPass1,
                };
                regisUser(payload).then(reponse => {
                    if (reponse === "Success") {
                        handleCard("member");
                    } else {
                        setName("");
                        setPass1('');
                        setPass2('');
                    }
                })
            } else {
                setPass1('');
                setPass2('');
            };
        };
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            registerUser();
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
                <Stack direction="row" spacing={2}>
                    <TextField
                        id="outlined password1"
                        label="Password"
                        type="password"
                        color="primary"
                        focused
                        value={isPass1}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        inputProps={{ maxLength: 8 }}
                        sx={{
                            input: { height: 10, color: 'white', fontSize: 16, textAlign: 'center' },
                        }}
                        />
                    <TextField
                        id="outlined password2"
                        label="Confirm Password"
                        type="password"
                        color="primary"
                        focused
                        value={isPass2}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        inputProps={{ maxLength: 8 }}
                        sx={{
                            input: { height: 10, color: 'white', fontSize: 16, textAlign: 'center' },
                        }}
                        />
                </Stack>
                <Button onClick={registerUser} sx={{ 
                        height: 50, 
                        color: 'white', 
                        fontSize: 16,
                        fontWeight: 'bold',
                        letterSpacing: 2,
                    }}>
                    <span>Register</span>
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
                    <Button onClick={() => handleCard("member")} sx={{ 
                            height: 20, 
                            width: 155,
                            color: 'white', 
                            fontSize: 10,
                        }}>
                        <span>Login</span>
                    </Button>
                </div>
            </Stack>
        </>
     );
};

export default Register;