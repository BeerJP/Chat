import { React } from "react";
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rooms from "./rooms.js";
import Users from "./users.js";


function Listbox() {

    const user = useSelector((state) => state.user.name);
    const type = useSelector((state) => state.user.type);
    const room = useSelector((state) => state.room.name);

    const logOut = () => {
        localStorage.removeItem('token');
        window.location = '/';
    }

    return (
        <>
            <Card sx={{ width: 'auto', height: 580, background: 'rgba(0, 0, 0, 0.7)' }}>
                <Card sx={{ width: 'auto', height: 'auto', background: 'rgba(0, 0, 0, 0)' }}>
                    <Stack  key={1} spacing={2} direction="row" alignItems="center" justifyContent={"space-between"} sx={{ my: 1, pt: 1, px: 3, }}>
                        <Typography noWrap sx={{ fontSize: 14 }} color="white">
                            <span>{user}</span>
                        </Typography>
                        <Button onClick={logOut} variant="text" color="error" sx={{ fontSize: 10, width: 10 }}>
                            <span>Exit</span>
                        </Button>
                    </Stack >
                </Card>
                <Rooms room={room}/>
                {
                    type ? <Users room={room} user={user}/> : <></>
                }
            </Card>
        </>
    );
};

export default Listbox;