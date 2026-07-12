import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css"

function CustomerNavbar({ city, cities, handleCity, isHome, isGuest}) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("id")
        localStorage.removeItem("login")
        toast.success("Successfully logged Out")
        navigate("/")
    }

    return (
        <div className="navbar">
            {!isHome && <Link to="/">Home</Link>}
            {isHome && isGuest && <Link to="/login">Login</Link>}
            {isHome && isGuest && <Link to="/registeration">Register</Link>}
            {!isGuest && <p>Hello, {localStorage.getItem("name") || "Customer"}</p>}
            {isHome && <select onChange={handleCity} value={city}>
                {cities.map(i => <option value={i}>{i}</option>)}
            </select >}
            <p>SearchBar</p>
            {!isGuest && <Link to="/cart">Cart</Link>}
            {!isGuest && <Link to="/orders">Orders</Link>}
            {!isGuest && <button onClick={handleLogout}>Logout</button>}
        </div>
    )
}

export default CustomerNavbar