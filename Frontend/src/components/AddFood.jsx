import React, { useState } from "react";
import "../style/addfood.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function AddFood(){
    const navigate = useNavigate();
    let id = localStorage.getItem("id");
    const categories = [
        "Pizza",
        "Burger",
        "Chinese",
        "North Indian",
        "South Indian",
        "Biryani",
        "Rolls",
        "Sandwich",
        "Fast Food",
        "Desserts",
        "Ice Cream",
        "Beverages",
        "Bakery",
        "Street Food",
        "Momos",
        "Pasta",
        "Salads",
        "Healthy Food",
        "Coffee",
        "Juices"
    ];
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        r_id: id,
        is_veg: true,
        availability: true,
        img_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL2a8mpGPRqqiVGmjV-XuhpdE5n3duNtapPiz6jeR_mQwzqWQWHTCham0&s=10"
    });
    async function handleSubmit(event){
        event.preventDefault();
        if(data.name == "" || data.price == ""){
            toast.error("Fill * details.");
        }
        else{
            let result = await fetch("http://localhost:3000/addFood", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data })
            });
            result = await result.json();
            if(result.success){
                toast.success("Saved successfully!");
                navigate("/homeRestaurant");
            }
            else{
                toast.error("Something went wrong.");
            }
        }
    }
    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    function handleChoice(event){
        const name = event.target.name;
        const checked = event.target.checked;
        setData((prev) => ({
            ...prev,
            [name]: checked
        }));
    }
    return(
        <div className="signup-page">
            <div className="signup-wrap">
                <div className="signup-logo">
                    <div className="signup-logo__icon">
                        ✕
                    </div>
                    <span>SpiceRush</span>
                </div>
                <h1>Add New Item</h1>
                <p className="signup-sub">
                    Add a dish to your restaurant's menu.
                </p>
                <div className="signup-card">
                    <form onSubmit={handleSubmit}>
                        <label>Name*</label>
                        <div className="field">
                            <span className="field-icon">
                                🍽
                            </span>
                            <input
                                placeholder="Enter food name"
                                type="text"
                                value={data.name}
                                onChange={handleChange}
                                name="name"
                                autoComplete="off"
                            />
                        </div>
                        <label>Description</label>
                        <div className="field field--textarea">
                            <textarea
                                placeholder="Enter food description"
                                rows={4}
                                value={data.description}
                                onChange={handleChange}
                                name="description"
                            />
                        </div>
                        <label>Price (Rupees)*</label>
                        <div className="field field--phone">
                            <span className="phone-prefix">
                                ₹
                            </span>
                            <input
                                placeholder="Enter price"
                                type="number"
                                value={data.price}
                                onChange={handleChange}
                                name="price"
                            />
                        </div>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                name="is_veg"
                                checked={data.is_veg}
                                onClick={handleChoice}
                            />
                            Is Veg
                        </label>
                        <label>Category</label>
                        <div className="field field--select">
                            <select
                                onChange={handleChange}
                                name="category"
                            >
                                {
                                    categories.map((i) => {
                                        return(
                                            <option
                                                value={i}
                                                key={i}
                                            >
                                                {i}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <label>Image URL</label>
                        <div className="field">
                            <span className="field-icon">
                                🖼
                            </span>
                            <input
                                placeholder="Enter image URL"
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
                            Add Item
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AddFood;