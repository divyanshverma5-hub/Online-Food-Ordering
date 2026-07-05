import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HomeRestaurant.css"
import EditFood from "./EditFood";
function HomeRestaurant() {

    const [showEdit, setShowEdit] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const [data, setData] = useState([]);
    const [food, setFood] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        let getData = async () => {
            let id = localStorage.getItem("id");
            let result = await fetch(`http://localhost:3000/homeRestaurant?id=${id}`);
            result = await result.json();
            console.log(result.food_list);
            await setData(result.ans)
            await setFood(result.food_list);
        }
        getData();

    }, [])

    async function handleDelete(event) {
        console.log(event.target.id)
        let result = await fetch(`http://localhost:3000/homeRestaurant/delete/${event.target.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data })
        });
        setFood(i =>
            food.filter(i => i.id !== Number(event.target.id)) //****Imp
        )
        // navigate("/homeRestaurant") 
    }

    function handleEdit(item) {
        setSelectedFood(item);
        setShowEdit(true);
    }

    // console.log(data);
    // console.log(food);
    return (
        <>
            <h1>(R.name) {data.restaurant_name}</h1>
            <p>Welcome {data.owner_name}!</p>
            <h3>City: {data.city}</h3>

            <Link to={'/addFood'}>Add</Link>

            <h1>Menu</h1>
            <div className="menuCard">

                {food.map((i) => (
                    <div className="box">

                        <img src={i.img_url} alt={i.food_name} />

                        <div>
                            <h2>{i.food_name}</h2>
                            <p>{i.description}</p>
                            <h3>₹{i.price}</h3>

                            <div>
                                <button onClick={handleDelete} id={i.id}>Delete</button>
                                {/* <button onClick={handleEdit} id={i.id}>Edit</button> */}
                                <button onClick={() => handleEdit(i)}>Edit</button>
                            </div>

                        </div>

                    </div>
                ))}

            </div>
            {showEdit && (
                <EditFood
                    food={selectedFood}
                    close={() => setShowEdit(false)}
                />
            )}
        </>
    );
}

export default HomeRestaurant;