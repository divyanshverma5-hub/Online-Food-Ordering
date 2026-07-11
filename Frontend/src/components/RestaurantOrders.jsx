import React, { useEffect, useState } from "react";
import ViewItems from "./ViewItems";
function RestaurantOrders() {

    let restaurant_id = localStorage.getItem("id");

    const [detail, setDetail] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [show, setShow] = useState("");

    let pending = detail.filter((i) => i.status == "Pending");
    let active = detail.filter((i) => (i.status != "Delivered" && i.status != "Pending" && i.status != "Rejected"))
    let history = detail.filter((i) => (i.status == "Delivered" || i.status == "Rejected"));

    let getData = async () => {
        let result = await fetch(`http://localhost:3000/order/restaurant/details?id=${restaurant_id}`);
        result = await result.json();
        setDetail(result.detail);
    }

    useEffect(() => {
        getData();
    }, [])

    async function seeDishes(order_id) {
        console.log(order_id);
        let result = await fetch(`http://localhost:3000/order/seeDishes?id=${order_id}`)
        result = await result.json();
        // console.log(result.dishes);
        setDishes(result.dishes);

        if (show === order_id) {
            setShow(null);
        }
        else {
            setShow(order_id);
        }
    }


    async function handleChoice(choice, order_id) {
        console.log(order_id)
        await fetch("http://localhost:3000/order/changeStatus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ choice, order_id })
        })

        getData();
    }

    // console.log(dishes)
    // console.log(detail)

    return (
        <>
            <h1>Orders:</h1>
            <h2>🟢 New Orders ({pending.length})</h2>
            <hr />
            {pending.map((i) => {
                return (
                    <div>
                        <h2># Order {i.id}</h2>
                        <h3>Customer name: {i.name}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>Ordered at: {new Date(i.order_at).toLocaleString()}</h3>
                        <h3>Status: {i.status}</h3>
                        <button onClick={() => seeDishes(i.id)}>View Details</button>

                        <button onClick={() => handleChoice("Preparing", i.id)}>Accept</button>
                        <button onClick={() => handleChoice("Rejected", i.id)}>Reject</button>

                        {show == i.id && <ViewItems
                            order={i}
                            dishes={dishes} />
                        }
                    </div>
                )
            })}

            <h2>🟡 Active Orders ({active.length})</h2>
            <hr />
            {active.map((i) => {
                return (
                    <div>
                        <h2># Order {i.id}</h2>
                        <h3>Customer Name: {i.name}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>Ordered at: {new Date(i.order_at).toLocaleString()}</h3>
                        <h3>Status: {i.status}</h3>
                        <select onChange={(e) => handleChoice(e.target.value, i.id)}>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <button onClick={() => seeDishes(i.id)}>View Details</button>

                        {show == i.id && <ViewItems
                            order={i}
                            dishes={dishes} />}
                    </div>
                )
            })}

            <h2>Past Orders:</h2>
            <hr />
            {history.map((i) => {
                return (
                    <div>
                        <h2># Order {i.id}</h2>
                        <h3>{i.name}</h3>
                        <h3>{i.status}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>{new Date(i.order_at).toLocaleString()}</h3>
                        <button onClick={() => seeDishes(i.id)}>View Details</button>
                        {show == i.id && <ViewItems
                            order={i}
                            dishes={dishes} />}
                    </div>
                )
            })}
        </>
    )
}

export default RestaurantOrders;