import { React, useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Up from "../assets/up-arrow.png"
import Down from "../assets/down-arrow.png"
import { getUsers } from '../api/apiFunctions.js';


function Listbox({ member, token, user }) {

    const [isMember, setMember] = useState([])
    const [isOpen, setOpen] = useState(true)

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

    const handleClick = () => {
        setOpen(!isOpen)
    }

    const logOut = () => {
        localStorage.removeItem("token");
        window.location = '/';;
    }

    return (
        <>
            <Card sx={{ width: 'auto', height: '100%', background: 'rgba(0, 0, 0, 0.7)' }}>
                <Card sx={{ width: 'auto', height: 'auto', background: 'rgba(0, 0, 0, 0)' }}>
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
                <List sx={{ width: '100%' }}>
                    <ListItemButton onClick={handleClick} sx={{ 
                                background: 'rgba(0, 0, 0, 0)', 
                                color:"white", 
                                fontSize: 12, ml: 1, 
                                fontWeight: 'bolder',
                                justifyContent: "space-between",
                            }} >
                        <span>Member</span>
                        <Avatar sx={{ width: 20, height: 20, mr: 3 }} src={isOpen ? Up : Down}/>
                    </ListItemButton>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Card sx={{ width: 'auto', height: 'auto', overflow: 'auto', background: 'rgba(0, 0, 0, 0)', }}>
                                {isMember && isMember.map((item, index) => (
                                    <Stack  key={index} spacing={2} direction="row" 
                                            alignItems="center" 
                                            sx={{ 
                                                my: 1,
                                                pt: 1,
                                                px: 3,
                                            }}>
                                        <Typography noWrap sx={{ fontSize: 12 }} color="white">
                                            {item.user}
                                        </Typography>
                                    </Stack >
                                ))}
                                <Stack spacing={2} direction="row" 
                                        alignItems="center"
                                        sx={{ 
                                            my: 2,
                                            pt: 1,
                                            px: 3,
                                        }}>
                                    <Typography noWrap color="white" sx={{ fontSize: 12, fontWeight: 'bolder' }}>
                                        <span>Guest ( 0 )</span>
                                    </Typography>
                                </Stack >
                            </Card>
                        </List>
                    </Collapse>
                </List>
            </Card>
        </>
    );
};

export default Listbox;