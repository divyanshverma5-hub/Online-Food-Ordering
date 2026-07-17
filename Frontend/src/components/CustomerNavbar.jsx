import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css";

function CustomerNavbar({ city, cities, handleCity, isHome, isGuest, setSearchData, handleDetectedCity }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("")

    function handleLogout() {
        localStorage.removeItem("id");
        localStorage.removeItem("login");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        toast.success("Successfully logged Out");
        navigate("/");
    }
    
    // GPS Location: 
    async function handleLocation() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                let result = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );

                result = await result.json();
                const detectedCity = result.address.city || result.address.town || result.address.village;

                if (cities.includes(detectedCity)) {
                    handleDetectedCity(detectedCity);
                    toast.success(`Location detected: ${detectedCity}`);
                } else {
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
            toast.warning("Please write something to search")
        }
        let city = localStorage.getItem("city") || "New Delhi"
        let result = await fetch(`http://localhost:3000/search?category=${searchText}&city=${city}`)
        result = await result.json();

        setSearchData(result.restaurants);
        navigate("/")
    }
    const name = localStorage.getItem("name") || "Customer";
    const firstName = name?.split(" ")[0];

    return (
        <div className="navbar">
            <Link to="/" className="nav-brand">
                FoodHub
            </Link>
            <div className="nav-links">
                {/* {!isHome &&
                    <Link to="/">
                        Home
                    </Link>
                } */}
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
                {isHome && cities &&
                    <select className="nav-city" onChange={handleCity} value={city}>
                        {cities.map((i) =>
                            <option key={i} value={i}>
                                {i}
                            </option>
                        )}
                    </select>
                }
            </div>
            {isHome &&<button onClick={handleLocation}>Get Location</button>}
            <div className="nav-search">
                <div>
                    <input placeholder="Search here..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
                    <button onClick={SearchButton}>Search</button>
                </div>
            </div>
            <div className="nav-right">
                {!isGuest &&
                    <>
                        <span className="nav-hello">
                            Hi, {firstName}
                        </span>

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
        </div>
    );
}
export default CustomerNavbar;