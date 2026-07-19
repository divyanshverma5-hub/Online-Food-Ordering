import React, { useState } from "react";
import "../style/registeration.css";
import { useNavigate } from "react-router-dom";

function EditFood({ food, close }) {

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
    ]

    const [data, setData] = useState(food);
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    function handleChange(e) {
        const { name, value } = e.target;

        setData(prev => ({
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
        }))
    }

    async function handleSave() {

        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("availability", data.availability);
        formData.append("description", data.description);
        formData.append("food_name", data.food_name);
        formData.append("is_veg", data.is_veg);
        formData.append("price", data.price);
        formData.append("image", image);
        formData.append("id", data.id);
        formData.append("restaurant_id", data.restaurant_id);
        formData.append("cloudinary_public_id", data.cloudinary_public_id);
        formData.append("img_url", data.img_url);

        let result = await fetch(`http://localhost:3000/homeRestaurant/edit`, {
            method: "PATCH",
            credentials: "include",
            body: formData
        });
        window.location = "/homeRestaurant"
    }

    return (
        <div className="overlay">

            <div className="popup">
                <h1>Edit Food</h1>

                <h3>Name</h3>
                <input name="food_name" value={data.food_name} onChange={handleChange} />

                <h3>Description</h3>
                <textarea rows={4} name="description" value={data.description} onChange={handleChange} />

                <h3>Price</h3>
                <input type="number" name="price" value={data.price} onChange={handleChange} />

                <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" name="is_veg" checked={data.is_veg} onClick={handleChoice} />
                    <h3>Is Veg</h3>
                </div>

                <h3>Category: </h3>
                <select onChange={handleChange} name="category">
                    {categories.map((i) => {
                        return (
                            <option value={i}>{i}</option>
                        )
                    })}
                </select>                

                {/* <input placeholder="Enter category" type="text" value={data.category} onChange={handleChange} name="category" /> */}

                <h3>Image: </h3>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                {/* <input placeholder="Enter image URL" type="text" value={data.img_url} onChange={handleChange} name="img_url" /> */}

                <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" name="availability" checked={data.availability} onClick={handleChoice} />
                    <h3>Is Available</h3>
                </div>

                <button onClick={handleSave}>Save</button>
                <button onClick={close}>Cancel</button>
            </div>

        </div>
    );
}

export default EditFood;