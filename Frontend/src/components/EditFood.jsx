import React, { useState } from "react";
import "../style/registeration.css";
import { useNavigate } from "react-router-dom";

function EditFood({ food, close }) {

    const [data, setData] = useState(food);

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
        console.log(data)

        let result = await fetch(`http://localhost:3000/homeRestaurant/edit`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data })
        });
        // result = result.json();
        window.location = "/homeRestaurant"
        // if (result.success){

        // }
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
                <input placeholder="Enter category" type="text" value={data.category} onChange={handleChange} name="category" />

                <h3>Image: </h3>
                <input placeholder="Enter image URL" type="text" value={data.img_url} onChange={handleChange} name="img_url" />

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