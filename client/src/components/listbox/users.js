import { React, useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setRoom } from '../../hooks/roomSlice.js';
import { getUsers } from '../../api/apiFunctions.js';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import Up from "../../assets/up-arrow.png"
import Down from "../../assets/down-arrow.png"
import Online from "../../assets/green-dot.png"
import Offline from "../../assets/red-dot.png"


const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

function Users({ room, user }) {

    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const [isOpen, setOpen] = useState(true);
    const [isMember, setMember] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await delay(500);
            if (token) {
                getUsers(token).then(response => {
                    if (response) {
                        setMember(response);
                    };
                });
            };
        };
        fetchData();
    }, [token]);

    const handleClick = () => {
        setOpen(!isOpen);
    };

    return (
        <>
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
                                <ListItemButton  key={index+1} spacing={2} direction="row"
                                        disabled={item.user === user}
                                        selected={room === item.user}
                                        onClick={() => dispatch(setRoom(item.user))}
                                        alignItems="center" 
                                        sx={{  my: 1, pt: 1, pb: 1, pl: 3, pr: 5.5, justifyContent: "space-between", }}>
                                    <Typography noWrap sx={{ fontSize: 12 }} color="white">
                                        {item.user}
                                    </Typography>
                                    <Avatar sx={{ width: 12, height: 12 }} src={ item.state === "1" ? Online : Offline }/>
                                </ListItemButton >
                            ))}
                        </Card>
                    </List>
                </Collapse>
            </List>
        </>
    );
};

export default Users;