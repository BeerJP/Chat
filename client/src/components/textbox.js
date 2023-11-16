import { React, useMemo } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


function Textbox() {

    const text = [
        { 
            time: '20:41',
            name: 'Beer',
            word: 'Hello !'
        },
        { 
            time: '20:42',
            name: 'Noyna',
            word: 'Hello :)'
        },
        { 
            time: '20:42',
            name: 'Beer',
            word: 'How are you'
        },
        { 
            time: '20:42',
            name: 'Noyna',
            word: 'Good, are you'
        },
        { 
            time: '20:43',
            name: 'Beer',
            word: 'Good'
        },
        { 
            time: '20:43',
            name: 'Noyna',
            word: 'What would we do'
        },
    ]

    const renderedText = useMemo(() => {
        return text.map((item, index) => (
            <Typography key={index} sx={{ fontSize: 14 }} color="black">
                {item.time} : {item.name} : {item.word}
            </Typography>
        ));
    }, [text]);

    return (
        <>
            <Card sx={{ width: '100%', height: '100%', overflowY: 'scroll',
                }}>
                <CardContent>
                    {renderedText}
                </CardContent>
            </Card>
        </>
     );
}

export default Textbox;