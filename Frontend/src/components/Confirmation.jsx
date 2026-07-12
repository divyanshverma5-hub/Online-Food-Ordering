import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomerNavbar from "./CustomerNavbar";

function Confirmation() {
    useEffect(() => {
        toast.success("Ordered Successfully");
    }, [])
    return (
        <>
            <CustomerNavbar />
            <h1>Order Placed Successfully</h1>
            <h2>Thank You for ordering</h2>
            <h3>Extimated Time : 25-30 minutes</h3>
            <Link to={"/"}>Back to Home</Link>
            <Link to={"/orders"}>See Order</Link>
        </>
    )
}

export default Confirmation;