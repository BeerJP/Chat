import { React, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getUsers } from '../api/apiFunctions.js';


function Listbox({ token }) {
    const [isMember, setMember] = useState([])

    useEffect(() => {
        if (token) {
            getUsers(token)
                .then(response => {
                    if (response) {
                        setMember(response);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [token])

    return (
        <>
            <Card sx={{ width: 'auto', height: 420, overflow: 'auto', background: 'rgba(0, 0, 0, 0.7)' }}>
                {isMember && isMember.map((item, index) => (
                    <Stack key={index} spacing={2} direction="row" alignItems="center" justifyContent={"space-between"} sx={{ my: 1, px: 1 }}>
                        <Typography noWrap sx={{ fontSize: 14, pl: 2 }} color="white">
                            {item.user}
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, mx: 1 }}>
                            {item.user.charAt(0)}
                        </Avatar>
                    </Stack >
                ))}
            </Card>
        </>
    );
};

export default Listbox;