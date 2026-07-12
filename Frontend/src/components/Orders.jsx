import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
function Orders() {

    let customer_id = localStorage.getItem("id");

    const [detail, setDetail] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [show, setShow] = useState("");

    useEffect(() => {

        let getData = async () => {
            let result = await fetch(`http://localhost:3000/order/details?id=${customer_id}`);
            result = await result.json();
            setDetail(result.detail);
        }

        getData();
    }, [])

    let pending = detail.filter((i) => i.status != "Delivered");
    let history = detail.filter((i) => i.status == "Delivered");

    // console.log("pending");
    // console.log(detail);

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


    return (
        <>
            <CustomerNavbar/>
            <h1>Orders History</h1>

            <h2>🟢 Ongoing Orders </h2>
            {pending.map((i) => {
                return (
                    <div>
                        <h2>{i.restaurant_name}</h2>
                        <h3>₹{i.total_price}</h3>
                        <h3>Ordered at: {new Date(i.order_at).toLocaleString()}</h3>
                        <h3>Status: {i.status}</h3>
                        <button onClick={() => seeDishes(i.id)}>View Items</button>
                        {show == i.id &&
                            <div style={{ backgroundColor: "pink" }}>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dishes.map(i => {
                                        return (
                                            <tr>
                                                <td>{i.food_name}</td>
                                                <td>{i.price_at_purchase}</td>
                                                <td>{i.quantity}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </div>}
                    </div>
                )
            })}

            <h2>Past orders:</h2>
            {history.map((i) => {
                return (
                    <div>
                        <h2>{i.restaurant_name}</h2>
                        <h3>{i.status}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>{new Date(i.order_at).toLocaleString()}</h3>
                        <button onClick={() => seeDishes(i.id)}>View Items</button>
                        {show == i.id &&
                            <div style={{ backgroundColor: "pink" }}>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dishes.map(i => {
                                        return (
                                            <tr>
                                                <td>{i.food_name}</td>
                                                <td>{i.price_at_purchase}</td>
                                                <td>{i.quantity}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </div>}
                    </div>
                )
            })}

        </>
    )
}

export default Orders