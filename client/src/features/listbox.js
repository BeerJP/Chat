import { React, useState } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rooms from "../components/listbox/rooms.js";
import Users from "../components/listbox/users.js";


function Listbox({ isToken, isUser }) {

    const [isSelected, setSelected] = useState(0)

    const logOut = () => {
        localStorage.removeItem("token");
        window.location = '/';
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
                            <span>{isUser}</span>
                        </Typography>
                        <Button onClick={logOut} variant="text" color="error" sx={{ fontSize: 10, width: 10 }}>
                            <span>Exit</span>
                        </Button>
                    </Stack >
                </Card>
                <Rooms isSelected={isSelected} setSelected={setSelected}/>
                {
                    isUser.substring(0, 5) === "Guest" ? <></>
                    :
                    <Users isSelected={isSelected} setSelected={setSelected} isToken={isToken} isUser={isUser}/>
                }
            </Card>
        </>
    );
};

export default Listbox;