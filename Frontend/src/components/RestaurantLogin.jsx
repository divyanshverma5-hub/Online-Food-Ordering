import React, { useState } from "react";
import '../style/registeration.css'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function RestaurantLogin() {

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    useEffect(()=>{
        if (localStorage.getItem('login') && localStorage.getItem('id')){
            toast.info("You are already logged in")
            navigate('/')
        }
    })

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        // console.log(data)
        let result = await fetch("http://localhost:3000/restaurantLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        result = await result.json();
        console.log(result);
        if (result.success) {
            document.cookie = "token=" + result.token;
            localStorage.setItem('id', result.id);
            localStorage.setItem('login', data.email);
            window.location = "/homeRestaurant";
        } else {
            alert("Try after sometime!");
        }
    }

    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        setData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    return (
        <>
            <form action="POST" className="container" onSubmit={handleSubmit}>
                <h1>Login As Owner</h1>
                <h3>Email</h3>
                <input placeholder="Enter email id" type="email" value={data.email} onChange={handleChange} name="email" />
                <h3>Password:</h3>
                <input placeholder="Enter password" value={data.password} onChange={handleChange} name="password" type="password" />
                <button type="submit" className="btnSubmit">Login</button>
                <Link to="/RestaurantRegister">SignUp</Link>
            </form>
        </>
    );
}

export default RestaurantLogin;