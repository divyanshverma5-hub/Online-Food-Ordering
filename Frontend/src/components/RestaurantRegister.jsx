import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import'../style/registeration.css'

function RestaurantRegister() {

    const [data, setData] = useState({
        owner_name: "",
        r_name:"",
        email: "",
        password: "",
        phone:"",
        location:"",
        city:"",
        img_url:"https://b.zmtcdn.com/data/pictures/7/22645887/48f15dd0608d788c0ab56d19bac1edb0.jpg"
    });


    useEffect(() => {
        if (localStorage.getItem('role')=="restaurant") {
            toast.info("You are already logged in")
            navigate('/homeRestaurant')
            //NAVIGATE IT TO HOME PAGE OF RESTAURANT SIDE!
        }
    })

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        let result = await fetch("http://localhost:3000/restaurantRegister", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        result = await result.json();
        console.log(result);
        if (result.success) {
            document.cookie = "token=" + result.token
            localStorage.setItem('login', data.email);
            localStorage.setItem('name', data.owner_name);
            localStorage.setItem('id', result.id);
            localStorage.setItem("role", "restaurant");
            window.location='/homeRestaurant'
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
                <h1>Welcome Owners</h1>
                <h3>Owner Name</h3>
                <input placeholder="Enter your name" type="text" value={data.owner_name} onChange={handleChange} name="owner_name" />
                <h3>Restaurant Name*</h3>
                <input placeholder="Enter Restaurant's name" type="text" value={data.r_name} onChange={handleChange} name="r_name" />
                <h3>Email*</h3>
                <input placeholder="Enter email id" type="email" value={data.email} onChange={handleChange} name="email" />
                <h3>Password*</h3>
                <input placeholder="Enter password" value={data.password} onChange={handleChange} name="password" type="password" />

                <h3>Phone</h3>
                <input placeholder="827*****01" type="number" value={data.phone} onChange={handleChange} name="phone" />

                <h3>Location</h3>
                <input placeholder="Enter full address" type="text" value={data.location} onChange={handleChange} name="location" />
                <h3>City*</h3>
                <input placeholder="Enter name" type="text" value={data.city} onChange={handleChange} name="city" />

                    {/* img_url */}
                <h3>Restaurant Image</h3>
                <input placeholder="Enter name" type="text" value={data.img_url} onChange={handleChange} name="img_url" />

                <button type="submit" className="btnSubmit">Sign Up</button>
                <Link to="/restaurantLogin">Login</Link>
            </form>
        </>
    );
}

export default RestaurantRegister;