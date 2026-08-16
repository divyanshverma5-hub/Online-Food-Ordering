import React, { useState } from "react";
import "../style/addfoodpage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function AddFood() {
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
        availability: true
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    function handleImagePick(event) {
        const file = event.target.files[0];

        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function handleChoice(event) {
        const name = event.target.name;
        const checked = event.target.checked;

        setData((prev) => ({
            ...prev,
            [name]: checked
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (data.name == "" || data.price == "") {
            toast.error("Fill * details.");
        }
        else {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("r_id", data.r_id);
            formData.append("is_veg", data.is_veg);
            formData.append("availability", data.availability);

            if (image) {
                formData.append("foodImage", image);
            }

            let result = await fetch("http://localhost:3000/addFood", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            result = await result.json();

            if (result.success) {
                toast.success("Saved successfully!");
                navigate("/homeRestaurant");
            }
            else {
                toast.error(result.msg);
            }
        }
    }

    return (
        <div className="af-page">
            <div className="af-wrap">
                <div className="af-logo">
                    <div className="af-logo__icon">
                        ✕
                    </div>

                    <span>SpiceRush</span>
                </div>

                <h1>Add New Item</h1>

                <p className="af-sub">
                    Add a dish to your restaurant's menu.
                </p>

                <div className="af-card">
                    <form onSubmit={handleSubmit}>
                        <label>Name*</label>

                        <div className="af-field">
                            <span className="af-field-icon">
                                🍽
                            </span>

                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Enter food name"
                                autoComplete="off"
                                onChange={handleChange}
                            />
                        </div>

                        <label>Description</label>

                        <div className="af-field af-field--textarea">
                            <textarea
                                rows={4}
                                name="description"
                                value={data.description}
                                placeholder="Enter food description"
                                onChange={handleChange}
                            />
                        </div>

                        <label>Price (Rupees)*</label>

                        <div className="af-field af-field--phone">
                            <span className="phone-prefix">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="price"
                                value={data.price}
                                placeholder="Enter price"
                                onChange={handleChange}
                            />
                        </div>

                        <label className="af-checkbox-row">
                            <input
                                type="checkbox"
                                name="is_veg"
                                checked={data.is_veg}
                                onClick={handleChoice}
                            />

                            Is Veg
                        </label>

                        <label>Category</label>

                        <div className="af-field af-field--select">
                            <select
                                name="category"
                                onChange={handleChange}
                            >
                                {categories.map((i) => (
                                    <option
                                        key={i}
                                        value={i}
                                    >
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label>Food Image</label>

                        <div className="af-upload-box">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="af-upload-preview"
                                />
                            ) : (
                                <span className="af-upload-placeholder">
                                    🖼
                                </span>
                            )}

                            <label
                                className="af-upload-btn"
                                htmlFor="foodImageInput"
                            >
                                📷 {preview ? "Change Image" : "Upload Image"}
                            </label>

                            <input
                                id="foodImageInput"
                                className="af-upload-input"
                                type="file"
                                accept="image/*"
                                name="foodImage"
                                onChange={handleImagePick}
                            />
                        </div>

                        <button
                            type="submit"
                            className="af-btnSubmit"
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