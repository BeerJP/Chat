import { React, Fragment } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Textbox from "../components/textbox";
import Listbox from "../components/listbox";
import Inputbox from "../components/inputbox";


function Chatpage() {
    return ( 
        <>
            <Fragment>
                <Container maxWidth="md">
                    <Box m={1} sx={{ 
                            bgcolor: 'red', 
                            height: '95vh', 
                            borderRadius: 1,
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 0.3,
                            gridTemplateRows: '1fr',
                            gridTemplateAreas: 
                            `
                                "main main main sidebar"
                                "footer footer footer footer"
                            `
                        }} >
                        <Box sx={{ gridArea: 'main' }}><Textbox/></Box>
                        <Box sx={{ gridArea: 'sidebar' }}><Listbox/></Box>
                        <Box sx={{ gridArea: 'footer' }}><Inputbox/></Box>
                    </Box>
                </Container>
            </Fragment>
        </>
     );
}

export default Chatpage;