import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import'../style/registeration.css'

function Registeration() {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone:""
    });


    useEffect(() => {
        if (localStorage.getItem('login')) {
            toast.info("You are already logged in")
            navigate('/')
        }
    })


    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        let result = await fetch("http://localhost:3000/registeration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        result = await result.json();
        console.log(result);
        if (result.success) {
            document.cookie = "token=" + result.token
            localStorage.setItem('login', data.email);
            localStorage.setItem('name', data.name);
            localStorage.setItem('id', result.id);
            localStorage.setItem("role", "customer");
            // navigate("/");
            window.location='/'
        } else{
            toast.error(result.msg);
        }
    }

    function handleChange(event) {
        let name1 = event.target.name;
        let value = event.target.value;

        setData(prev => ({
            ...prev,
            [name1]: value
        }))
    }

    return (
        <>
            <form action="POST" className="container" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <h3>Name</h3>
                <input placeholder="Enter name" type="text" value={data.name} onChange={handleChange} name="name" />
                <h3>Email</h3>
                <input placeholder="Enter email id" type="email" value={data.email} onChange={handleChange} name="email" />
                <h3>Password:</h3>
                <input placeholder="Enter password" value={data.password} onChange={handleChange} name="password" type="password" />
                <h3>Phone*</h3>
                <input placeholder="Enter phone number" value={data.phone} onChange={handleChange} name="phone" type="number" />
                <button type="submit" className="btnSubmit">Sign Up</button>
                <Link to="/login">Login</Link>
            </form>
        </>
    );
}

export default Registeration;