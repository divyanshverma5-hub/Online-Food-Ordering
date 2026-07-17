import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";
import Footer from "./Footer";
import CustomerNavbar from "./CustomerNavbar";


function Login() {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("login")) {
            toast.info("You are already logged in");
            navigate("/");
        }
    }, []);
    async function handleSubmit(event) {
        event.preventDefault();
        let result = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        result = await result.json();
        console.log(result);

        if (result.success) {
            document.cookie = "token=" + result.token;
            localStorage.setItem("login", data.email);
            localStorage.setItem("id", result.id);
            localStorage.setItem("role", "customer");
            localStorage.setItem("name", result.name);
            window.location = "/";
        }
        else {
            toast.error("Wrong Username or Password")
            // alert("Try after sometime!");
        }
    }
    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    return (
        <div className="login-page">
            <div className="login-main">
                <div className="login-left">
                    <img
                        className="login-hero-img"
                        src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
                        alt="Indian thali"
                    />
                    <div className="login-features">
                        <div className="feature-card">
                            <h4>   Track Orders
                            </h4>
                            <p>
                                Live updates from the kitchen to your doorstep.
                            </p>
                        </div>
                        <div className="feature-card feature-card--accent">
                            <div className="feature-icon">
                                ★
                            </div>
                            <h4>
                                Spice Rewards
                            </h4>
                            <p>
                                Earn points on every meal for exclusive discounts.(Coming soon)
                            </p>
                        </div>
                    </div>
                </div>
                <div className="login-card">
                    <h1>
                        Welcome Back
                    </h1>
                    <p className="login-sub">
                        Login to order food
                    </p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Email Address
                        </label>
                        <div className="field">
                            <span className="field-icon">
                                ✉
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="krishna@email.com"
                                value={data.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="field-label-row">
                            <label>
                                Password
                            </label>
                        </div>
                        <div className="field">
                            <span className="field-icon">
                                🔒
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Password"
                                value={data.password}
                                onChange={handleChange}
                            />
                            <span
                                className="field-icon field-icon--right"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                👁
                            </span>
                        </div>
                        <button type="submit" className="btnSubmit">
                            Login
                        </button>
                        <div className="divider">
                            or continue with
                        </div>
                        <div className="oauth-row">
                            <button type="button" className="oauth-btn">
                                Google
                            </button>
                            <button type="button" className="oauth-btn">
                                 Apple
                            </button>
                        </div>
                        <div className="switch-line"> New Here? then make an account{" "}
                            <Link to="/registeration">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;