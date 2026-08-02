import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../style/editfood.css";

function EditFood({ food, close }) {

    const navigate = useNavigate();

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

    const [data, setData] = useState(food);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(food.img_url || null);

    function handleChange(event) {
        const { name, value } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function handleChoice(event) {
        const { name, checked } = event.target;

        setData((prev) => ({
            ...prev,
            [name]: checked
        }));
    }

    function handleImagePick(event) {
        const file = event.target.files[0];

        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : data.img_url);
    }

    async function handleSave() {

        const formData = new FormData();

        formData.append("id", data.id);
        formData.append("food_name", data.food_name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("is_veg", data.is_veg);
        formData.append("category", data.category);
        formData.append("availability", data.availability);
        formData.append("restaurant_id", data.restaurant_id);
        formData.append("img_url", data.img_url);
        formData.append("cloudinary_public_id", data.cloudinary_public_id);

        if (image) {
            formData.append("image", image);
        }

        await fetch("http://localhost:3000/homeRestaurant/edit", {
            method: "PATCH",
            credentials: "include",
            body: formData
        });

        window.location = "/homeRestaurant";
    }

    return (
        <div className="ef-overlay">

            <div className="ef-modal">

                <h1>Edit Food</h1>

                <label>Name</label>

                <div className="ef-field">
                    <input
                        name="food_name"
                        value={data.food_name}
                        onChange={handleChange}
                    />
                </div>

                <label>Description</label>

                <div className="ef-field">
                    <textarea
                        rows={4}
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                    />
                </div>

                <label>Price</label>

                <div className="ef-field">
                    <input
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="ef-checkbox-row">
                    <input
                        type="checkbox"
                        name="is_veg"
                        checked={data.is_veg}
                        onClick={handleChoice}
                    />
                    <label>Is Veg</label>
                </div>

                <label>Category</label>

                <div className="ef-field">
                    <select
                        name="category"
                        value={data.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <label>Image</label>

                <div className="upload-box">
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="upload-preview"
                        />
                    ) : (
                        <span className="upload-placeholder">
                            🖼
                        </span>
                    )}

                    <label
                        htmlFor="editFoodImageInput"
                        className="upload-btn"
                    >
                        📷 Change Image
                    </label>

                    <input
                        id="editFoodImageInput"
                        className="upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImagePick}
                    />
                </div>

                <div className="ef-checkbox-row">
                    <input
                        type="checkbox"
                        name="availability"
                        checked={data.availability}
                        onClick={handleChoice}
                    />
                    <label>Is Available</label>
                </div>

                <div className="ef-actions">
                    <button
                        className="ef-btn-cancel"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="ef-btn-save"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>

            </div>

        </div>
    );
}

export default EditFood;