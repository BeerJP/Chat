import { React } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setRoom } from '../../hooks/roomSlice.js';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';


function Rooms({ room }) {

    const dispatch = useDispatch();
    const nums = useSelector((state) => state.nums.online);

    return (
        <>
            <List sx={{ width: '100%' }}>
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Card sx={{ width: 'auto', height: 'auto', overflow: 'auto', background: 'rgba(0, 0, 0, 0)', }}>
                            <ListItemButton  key="1" spacing={2} direction="row" 
                                    selected={room === 'main'}
                                    onClick={() => dispatch(setRoom('main'))}
                                    alignItems="center" 
                                    sx={{  mb: 1, pt: 1, pb: 1, pl: 3, pr: 5, justifyContent: "space-between", }}>
                                <Typography noWrap sx={{ fontSize: 12 }} color="white">
                                    <span>Global Room</span>
                                </Typography>
                                <Typography noWrap sx={{ fontSize: 12 }} color="white">
                                    <span>( { nums } )</span>
                                </Typography>
                            </ListItemButton >
                        </Card>
                    </List>
                </Collapse>
            </List>
        </>
    );
};

export default Rooms;