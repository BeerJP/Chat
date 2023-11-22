import { React, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getUsers } from '../api/apiFunctions.js';


function Listbox({ member, token, user }) {

    const [isMember, setMember] = useState([])

    useEffect(() => {
        if (token) {
            getUsers(token).then(response => {
                if (response) {
                    setMember(response);
                }
            }).catch(error => {
                console.error(error);
            });
        };
    }, [token]);

    useEffect(() => {
        if (member.state === '1') {
            const isDuplicate = isMember.some(item => item.user === member.user);
            if (!isDuplicate) {
                setMember(prevMember => {
                    const updatedMember = [...prevMember, member];
                    updatedMember.sort((a, b) => a.user.localeCompare(b.user));
                    return updatedMember;
                });
            }
        } else if (member.state === '0') {
            const removeMember = isMember.filter(item => item.user !== member.user);
            setMember(removeMember);
        }
    }, [member])

    const logOut = () => {
        localStorage.removeItem("token");
        window.location = '/';;
    }

    return (
        <>
            <Card sx={{ width: 'auto', height: 50, background: 'rgba(0, 0, 0, 0.7)' }}>
                <Stack  key={1} spacing={2} direction="row" 
                        alignItems="center" 
                        justifyContent={"space-between"} 
                        sx={{ 
                            my: 1,
                            pt: 1,
                            px: 3,
                        }}>
                    <Typography noWrap sx={{ fontSize: 14 }} color="white">
                        <span>{user}</span>
                    </Typography>
                    <Button onClick={logOut} variant="text" color="error" sx={{ fontSize: 10, width: 10 }}>
                        <span>Exit</span>
                    </Button>
                </Stack >
            </Card>
            <Card sx={{ width: 'auto', height: 370, overflow: 'auto', background: 'rgba(0, 0, 0, 0.7)' }}>
                {isMember && isMember.map((item, index) => (
                    <Stack  key={index} spacing={2} direction="row" 
                            alignItems="center" 
                            sx={{ 
                                my: 1,
                                pt: 1,
                                px: 3,
                            }}>
                        <Typography noWrap sx={{ fontSize: 14 }} color="white">
                            {item.user}
                        </Typography>
                    </Stack >
                ))}
            </Card>
        </>
    );
};

export default Listbox;