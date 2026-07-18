import React,{useEffect,useState} from "react";
import {toast} from "react-toastify";
import {useNavigate,Link} from "react-router-dom";
import "../style/login.css";
import Footer from "./Footer";
function RestaurantLogin(){
    const[data,setData]=useState({
        email:"",
        password:""
    });
    const[showPassword,setShowPassword]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("role")=="restaurant"){
            toast.info("You are already logged in");
            navigate("/");
        }
    },[]);
    async function handleSubmit(event){
        event.preventDefault();
        let result=await fetch("http://localhost:3000/restaurantLogin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        result=await result.json();
        if(result.success){
            document.cookie="token="+result.token;
            localStorage.setItem("id",result.id);
            localStorage.setItem("name",result.name);
            localStorage.setItem("login",data.email);
            localStorage.setItem("role","restaurant");
            window.location="/homeRestaurant";
        }
        else{
            alert("Try after sometime!");
        }
    }
    function handleChange(event){
        let name=event.target.name;
        let value=event.target.value;
        setData((prev)=>({
            ...prev,
            [name]:value
        }));
    }
    return(
        <div className="login-page">
            <div className="login-main">
                <div className="login-left">
                    <img
                        className="login-hero-img"
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
                        alt="Restaurant kitchen"
                    />
                    <div className="login-features">
                        <div className="feature-card">
                            <div className="feature-icon">
                                
                            </div>
                            <h4>
                                Manage Orders
                            </h4>
                            <p>
                                Let us help you get more sales and manage them easily.
                            </p>
                        </div>
                        <div className="feature-card feature-card--accent">
                            <div className="feature-icon">
                                
                            </div>
                            <h4>
                                Grow your Business
                            </h4>
                            <p>
                               With us reach many customers who are hungry and grow your business.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="login-card">
                    <h1>
                        Restaraunt login
                    </h1>
                    <p className="login-sub">
                        Welcome back, Have a good day.
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
                                placeholder="Enter email id"
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
                                type={showPassword?"text":"password"}
                                name="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handleChange}
                            />
                            <span
                                className="field-icon field-icon--right"
                                onClick={()=>setShowPassword(!showPassword)}
                            >
                                👁
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="btnSubmit"
                        >
                            Login
                        </button>
                        <div className="switch-line">
                            New here ? Click on Sign up to register with us.{" "}
                            <Link to="/RestaurantRegister">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default RestaurantLogin;