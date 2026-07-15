//make it for the navbar containing (Location, login/register, logout, order, cart)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css"


function RestaurantNavbar({isHome}) {
    const navigate = useNavigate();
    function handleLogout() {
        localStorage.removeItem("id")
        localStorage.removeItem("login")
        toast.success("Successfully logged Out")
        navigate("/")
    }

    return (
        <div className="navbar">
            <p>👤 {localStorage.getItem("name") || "Owner"}</p>
            
            {!isHome && <Link to={'/homeRestaurant'}>Dashboard</Link>}
            <Link to={'/restaurantOrders'}>Orders</Link>
            <Link to={'/addFood'}>Add Food</Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
export default RestaurantNavbar