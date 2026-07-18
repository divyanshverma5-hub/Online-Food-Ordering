import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../style/registeration.css";
import Footer from "./Footer";
function RestaurantRegister() {
    const [data, setData] = useState({
        owner_name: "",
        r_name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        city: "",
        img_url: "https://b.zmtcdn.com/data/pictures/7/22645887/48f15dd0608d788c0ab56d19bac1edb0.jpg"
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("role") == "restaurant") {
            toast.info("You are already logged in");
            navigate("/homeRestaurant");
        }
    });
    async function handleSubmit(event) {
        event.preventDefault();
        let result = await fetch("http://localhost:3000/restaurantRegister", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        result = await result.json();
        if (result.success) {
            document.cookie = "token=" + result.token;
            localStorage.setItem("login", data.email);
            localStorage.setItem("name", data.owner_name);
            localStorage.setItem("id", result.id);
            localStorage.setItem("role", "restaurant");
            window.location = "/homeRestaurant";
        }
        else {
            toast.error(result.msg);
        }
    }
    function handleChange(event) {
        let name1 = event.target.name;
        let value = event.target.value;
        setData((prev) => ({
            ...prev,
            [name1]: value
        }));
    }
    return (
        <div className="signup-page">
            <div className="signup-wrap">
                <div className="signup-logo">
                    <div className="signup-logo__icon"></div>
                    <span>SpiceRush</span>
                </div>
                <h1>Register and grow your business with us</h1>
                <p className="signup-sub">
                    List your restaurant on SpiceRush and start reaching new customers.
                </p>
                <div className="signup-card">
                    <form onSubmit={handleSubmit}>
                        <label>Owner Name</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter your Full name"
                                type="text"
                                value={data.owner_name}
                                onChange={handleChange}
                                name="owner_name"
                            />
                        </div>
                        <label>Restaurant Name*</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter Restaurant's name"
                                type="text"
                                value={data.r_name}
                                onChange={handleChange}
                                name="r_name"
                            />
                        </div>
                        <label>Email Address*</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter email id"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                name="email"
                            />
                        </div>
                        <label>Password*</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handleChange}
                                name="password"
                                type={showPassword ? "text" : "password"}
                            />
                            <span
                                className="field-icon field-icon--right"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                👁
                            </span>
                        </div>
                        <label>Phone Number</label>
                        <div className="field field--phone">
                            <span className="phone-prefix">+91</span>
                            <input
                                placeholder="827*****01"
                                type="number"
                                value={data.phone}
                                onChange={handleChange}
                                name="phone"
                            />
                        </div>
                        <label>Location</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter full address"
                                type="text"
                                value={data.location}
                                onChange={handleChange}
                                name="location"
                            />
                        </div>
                        <label>City*</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Enter city"
                                type="text"
                                value={data.city}
                                onChange={handleChange}
                                name="city"
                            />
                        </div>
                        <label>Restaurant Image URL(If you have one please replace the link below)</label>
                        <div className="field">
                            <span className="field-icon"></span>
                            <input
                                placeholder="Image URL"
                                type="text"
                                value={data.img_url}
                                onChange={handleChange}
                                name="img_url"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btnSubmit"
                        >
                            Sign Up
                        </button>
                        <div className="divider">OR</div>
                        <div className="switch-line">
                            Have an account?{" "}
                            <Link to="/restaurantLogin">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default RestaurantRegister;