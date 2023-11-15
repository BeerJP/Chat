import * as React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Textbox from "../components/textbox";
import Listbox from "../components/listbox";


function Chatpage() {
    return ( 
        <>
            <React.Fragment>
            <CssBaseline />
                <Container maxWidth="md">
                    <Box m={1} sx={{ 
                            bgcolor: '#cfe8fc', 
                            height: '95vh', 
                            borderRadius: 1,
                            display: 'grid', 
                            gridTemplateColumns: '10fr 3fr',
                        }} >
                        <Textbox/>
                        <Listbox/>
                    </Box>
                </Container>
            </React.Fragment>
        </>
     );
}

export default Chatpage;