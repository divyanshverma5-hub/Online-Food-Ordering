import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css";
import ProfileCustomer from "./ProfileCustomer.jsx";
import { API_BASE } from "../config.js";

function CustomerNavbar({ city, cities, handleCity, isHome, isGuest, setSearchData, handleDetectedCity }) {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [cntCart, setCntCart] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            let result = await fetch(`${API_BASE}/cart/count`,{
                credentials: "include"
            });
            result = await result.json();

            setCntCart(result.cnt);
        }
        getCount();
    }, [])

    function handleLogout() {
        localStorage.removeItem("id");
        localStorage.removeItem("login");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        toast.success("Successfully logged Out");
        navigate("/");
    }
    async function handleLocation() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                let result = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                result = await result.json();
                const detectedCity = result.address.city || result.address.town || result.address.village;
                if (cities.includes(detectedCity)) {
                    handleDetectedCity(detectedCity);
                    toast.success(`Location detected: ${detectedCity}`);
                }
                else {
                    toast.info(`We currently don't serve ${detectedCity}`);
                }
            },
            (error) => {
                console.log(error);
                toast.error("Unable to get your location");
            }
        );
    }
    async function SearchButton() {
        if (searchText == "") {
            toast.warning("Please write something to search");
        }
        else {
            navigate(`/?search=${encodeURIComponent(searchText)}`);
        }
    }
    const name = localStorage.getItem("name") || "Customer";
    const firstName = name?.split(" ")[0];
    return (
        <div className="navbar">
            <Link to="/" className="nav-brand">FoodHub</Link>
            <div className="nav-links">

                {!isGuest &&
                    <Link to="/orders">
                        Orders
                    </Link>
                }
                {!isGuest &&
                    <Link to="/cart">
                        Cart
                    </Link>
                }

                {
                    isHome && cities &&
                    <div className="nav-location-group">
                        <select className="nav-city" onChange={handleCity} value={city}>
                            {cities.map((i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <button className="nav-location-btn" onClick={handleLocation} title="Detect my location">
                            <span className="nav-location-icon">📍</span> Get Location
                        </button>
                    </div>
                }
            </div >
            <div className="nav-search">
                <div>
                    <span className="nav-search-icon">🔍</span>

                    <input
                        type="text"
                        placeholder="Search food or restaurants"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                SearchButton();
                            }
                        }}
                    />

                    <button onClick={SearchButton}>
                        Search
                    </button>
                </div>
            </div>
            <div className="nav-right">
                {!isGuest &&
                    <>
                        <Link to="/profileCustomer" className="nav-profile-link">
                            <span className="nav-hello">
                                <span className="nav-profile-icon">👤</span> Hi, {firstName}
                            </span>
                        </Link>
                        <button className="nav-btn outline" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                }
                {isGuest &&
                    <>
                        <Link to="/login" className="nav-btn ghost">
                            Login
                        </Link>
                        <Link to="/registeration" className="nav-btn solid">
                            Signup
                        </Link>
                    </>
                }
            </div>
        </div >
    );
}
export default CustomerNavbar;