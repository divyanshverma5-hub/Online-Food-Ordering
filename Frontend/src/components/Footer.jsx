import React from "react";
import { Link } from "react-router-dom";

function Footer(){
    return(
        <>
        <h1>Footer</h1>
        <Link to="/restaurantRegister">Work with us</Link>
        </>
    );
}

export default Footer;