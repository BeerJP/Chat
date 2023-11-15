import * as React from "react";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


function Listbox() {

    const text = [
        { 
            name: 'Beer',
        },
        { 
            name: 'Noyna',
        },
    ]

    const renderedText = React.useMemo(() => {
        return text.map((item, index) => (
            <Stack sspacing={2} direction="row" alignItems="center" justifyContent={"space-between"} sx={{ my: 1, px: 1 }}>
                <Typography noWrap key={index} sx={{ fontSize: 14, pl: 2 }} color="black">
                    {item.name}
                </Typography>
                <Avatar sx={{ width: 24, height: 24, mx: 1 }}>
                    {item.name.charAt(0)}
                </Avatar>
            </Stack >
        ));
    }, [text]);

    return (
        <>
            <Card sx={{ width: 'auto', maxWidth: 200, overflow: 'auto' }}>
                {renderedText}
            </Card>
        </>
     );
}

export default Listbox;