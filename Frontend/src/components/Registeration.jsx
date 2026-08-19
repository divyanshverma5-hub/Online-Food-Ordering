import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../style/registeration.css";
import Footer from "./Footer";
import { GoogleLogin } from "@react-oauth/google";
import { API_BASE } from "../config";

function Registeration() {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("login")) {
            toast.info("You are already logged in");
            navigate("/");
        }
    });

    async function handleSubmit(event) {

        event.preventDefault();

        let result = await fetch(`${API_BASE}/registeration`, {
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
            localStorage.setItem("name", data.name);
            localStorage.setItem("id", result.id);
            localStorage.setItem("role", "customer");

            window.location = "/";

        }
        else {
            toast.error(result.msg);
        }
    }

    function handleChange(event) {

        let name1 = event.target.name;
        let value = event.target.value;

        setData(prev => ({
            ...prev,
            [name1]: value
        }));
    }

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await fetch(`${API_BASE}/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                }),
            });

            const result = await response.json();

            if (result.success) {

                document.cookie = "token=" + result.token;

                localStorage.setItem("login", result.user.email);
                localStorage.setItem("id", result.user.id);
                localStorage.setItem("role", "customer");
                localStorage.setItem("name", result.user.name);

                toast.success("Login Successful");

                window.location = "/";

            }
            else {
                toast.error(result.message || result.msg);
            }

        } catch (err) {
            console.error(err);
            toast.error("Google Login Failed");
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-wrap">

                <div className="signup-logo">

                    <div className="signup-logo__icon">

                    </div>

                    <span>
                        FoodHub
                    </span>

                </div>

                <h1>
                    Join FoodHub
                </h1>

                <p className="signup-sub">
                    Create an account to start ordering your favorite meals.
                </p>

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.log("Google Login Failed");
                    }}
                />

                <div className="signup-card">

                    <form onSubmit={handleSubmit}>

                        <label>
                            Full Name
                        </label>

                        <div className="field">

                            <span className="field-icon">
                                👤
                            </span>

                            <input
                                placeholder="Enter your full name"
                                type="text"
                                value={data.name}
                                onChange={handleChange}
                                name="name"
                            />

                        </div>

                        <label>
                            Email Address
                        </label>

                        <div className="field">

                            <span className="field-icon">
                                ✉
                            </span>

                            <input
                                placeholder="name@example.com"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                name="email"
                            />

                        </div>

                        <label>
                            Phone Number
                        </label>

                        <div className="field field--phone">

                            <span className="phone-prefix">
                                +91
                            </span>

                            <input
                                placeholder="98765 43210"
                                value={data.phone}
                                onChange={handleChange}
                                name="phone"
                                type="number"
                            />

                        </div>

                        <label>
                            Password
                        </label>

                        <div className="field">

                            <span className="field-icon">
                                🔒
                            </span>

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

                        <button
                            type="submit"
                            className="btnSubmit"
                        >
                            Create Account
                        </button>

                        <div className="divider">
                            OR
                        </div>

                        <div className="switch-line">

                            Already have an account?{" "}

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    </form>

                </div>

                <div className="signup-avatars">

                    <img
                        src="https://i.pravatar.cc/60?img=32"
                        alt=""
                    />

                    <img
                        src="https://i.pravatar.cc/60?img=45"
                        alt=""
                    />

                    <img
                        src="https://i.pravatar.cc/60?img=12"
                        alt=""
                    />

                </div>

                <p className="signup-join-text">
                    Join 20k+ foodies enjoying FoodHub
                </p>

            </div>

            <Footer />

        </div>
    );
}

export default Registeration;