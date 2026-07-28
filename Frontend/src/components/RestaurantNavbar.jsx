import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css"
function RestaurantNavbar({ isHome }) {
    const navigate = useNavigate();
    function handleLogout() {
        localStorage.removeItem("id")
        localStorage.removeItem("login")
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        toast.success("Successfully logged Out")
        navigate("/")
    }
    const name = localStorage.getItem("name") || "Customer";
    const firstName = name?.split(" ")[0];
    return (
        <div className="navbar">
            <Link to={'/homeRestaurant'} className="nav-brand">SpiceRush</Link>
            <div className="nav-links">
                {!isHome && <Link to={'/homeRestaurant'}>Dashboard</Link>}
                <Link to={'/restaurantOrders'}>Orders</Link>
                <Link to={'/addFood'}>Add Food</Link>
            </div>
            <div className="nav-right">
                <span className="nav-hello">👤 {firstName}</span>
                <button className="nav-btn solid" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
export default RestaurantNavbar
