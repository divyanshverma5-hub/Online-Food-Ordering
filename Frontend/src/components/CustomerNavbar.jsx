import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/customerNavbar.css";

function CustomerNavbar({ city, cities, handleCity, isHome, isGuest, setSearchData }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("")

    function handleLogout() {
        localStorage.removeItem("id");
        localStorage.removeItem("login");
        toast.success("Successfully logged Out");
        navigate("/");
    }

    async function SearchButton() {
        if (searchText == "") {
            toast.warning("Please write something to search")
        }
        let city = localStorage.getItem("city") || "New Delhi"
        let result = await fetch(`http://localhost:3000/search?category=${searchText}&city=${city}`)
        result = await result.json();

        // console.log(result);
        setSearchData(result.restaurants);
        navigate("/")
    }
    // console.log(searchText);
    return (
        <div className="navbar">
            <Link to="/" className="nav-brand">
                FoodHub
            </Link>
            <div className="nav-links">
                {!isHome &&
                    <Link to="/">
                        Home
                    </Link>
                }
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
                            Hi, {localStorage.getItem("name") || "Customer"}
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