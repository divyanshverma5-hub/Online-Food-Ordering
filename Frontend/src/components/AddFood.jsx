import React, { useState } from "react";
import '../style/registeration.css'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function AddFood() {
    const navigate = useNavigate();

    let id = localStorage.getItem("id");
    // console.log(id);
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


    async function handleSubmit(event) {
        event.preventDefault();
        if (data.name == "" || data.price == "") {
            toast.error("Fill * details.")
        }
        else {
            let result = await fetch("http://localhost:3000/addFood", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data })
            })

            result = await result.json();
            console.log(result);

            if (result.success) {
                toast.success("Saved successfully!")
                navigate("/homeRestaurant")
            }
            else {
                toast.error("Something went wrong.")
            }
        }

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
        }))
    }

    console.log(data);

    return (
        <>
            <form action="POST" className="container" onSubmit={handleSubmit}>
                <h1>Add New Item</h1>
                <h3>Name*</h3>
                <input placeholder="Enter food name" type="text" value={data.name} onChange={handleChange} name="name" autoComplete="off" />
                <h3>Description:</h3>
                <textarea placeholder="Enter food description" rows={4} value={data.description} onChange={handleChange} name="description" />

                <h3>Price (Rupees)*</h3>
                <input placeholder="Enter price" type="number" value={data.price} onChange={handleChange} name="price" />
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
                <input placeholder="Enter image URL" type="text" value={data.img_url} onChange={handleChange} name="img_url" />


                <button type="submit" className="btnSubmit">Add Item</button>

            </form>
        </>
    );
}

export default AddFood;