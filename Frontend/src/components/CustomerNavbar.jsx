import React from "react";
import {Link,useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "../style/customerNavbar.css";

function CustomerNavbar({city,cities,handleCity,isHome,isGuest}){
    const navigate=useNavigate();
    function handleLogout(){
        localStorage.removeItem("id");
        localStorage.removeItem("login");
        toast.success("Successfully logged Out");
        navigate("/");
    }
    return(
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
                        {cities.map((i)=>
                            <option key={i} value={i}>
                                {i}
                            </option>
                        )}
                    </select>
                }
            </div>
            <div className="nav-search">
                <p>
                    SearchBar
                </p>
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