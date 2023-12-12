import { React, useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import Up from "../../assets/up-arrow.png"
import Down from "../../assets/down-arrow.png"
import Online from "../../assets/green-dot.png"
import { getUsers } from '../../api/apiFunctions.js';


function Users({ isUser, isToken, isSelected, setSelected }) {

    const [isOpen, setOpen] = useState(true)
    const [isMember, setMember] = useState([])

    useEffect(() => {
        if (isToken) {
            getUsers(isToken).then(response => {
                if (response) {
                    setMember(response);
                };
            });
        };
    }, [isToken]);

    const handleClick = () => {
        setOpen(!isOpen)
    }

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
                                        disabled={item.user === isUser}
                                        selected={isSelected === index+1}
                                        onClick={() => setSelected(index+1)}
                                        alignItems="center" 
                                        sx={{  my: 1, pt: 1, pb: 1, pl: 3, pr: 5.5, justifyContent: "space-between", }}>
                                    <Typography noWrap sx={{ fontSize: 12 }} color="white">
                                        {item.user}
                                    </Typography>
                                    {
                                        item.state === "1" ?
                                        <Avatar sx={{ width: 12, height: 12 }} src={Online}/>
                                        :
                                        <></>
                                    }
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