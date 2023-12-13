import { React, useState } from "react";
import Guest from "./guest.js";
import Member from "./member.js";
import Register from "./register.js";


function Loginbox() {

    const [isCard, setCard] = useState("guest");

    return (
        <>
            {
                isCard === "guest" ? 
                <Guest handleCard={setCard}/>
                :
                isCard === "member" ? 
                <Member handleCard={setCard}/>
                :
                <Register handleCard={setCard}/>
            }
        </>
     );
};

export default Loginbox;