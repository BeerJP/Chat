import { React, useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';


function Loginbox() {

    const [isName, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    };

    const submit = () => {
        setName(isName);
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            submit();
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
                <Button onClick={submit} sx={{ 
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