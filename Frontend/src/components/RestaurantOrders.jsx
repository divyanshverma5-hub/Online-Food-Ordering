import React, { useEffect, useState } from "react";

function RestaurantOrders() {

    let restaurant_id = localStorage.getItem("id");

    const [detail, setDetail] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [show, setShow] = useState("");
    const [hide, setHide] = useState(false);

    let pending = detail.filter((i) => i.status == "Pending");
    let history = detail.filter((i) => (i.status == "Delivered" || i.status == "Rejected"));

    useEffect(() => {

        let getData = async () => {
            let result = await fetch(`http://localhost:3000/order/restaurant/details?id=${restaurant_id}`);

            result = await result.json();
            setDetail(result.detail);
            // console.log(result.detail)
        }

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

    //CONTINUE FROM HERE

    // function handleChoice() {
    //     let choice = event.target.name
    //     console.log(choice)
    //     setHide(true);

    //     if (choice === "reject") {

    //     }
    // }

    // console.log(dishes)

    return (
        <>
            <h1>Orders:</h1>
            <h2>🟢 Ongoing Orders </h2>
            <hr />
            {pending.map((i) => {
                return (
                    <div>
                        <h2># Order {i.id}</h2>
                        <h3>{i.name}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>Ordered at: {i.order_at}</h3>
                        <h3>Status: {i.status}</h3>
                        <button onClick={() => seeDishes(i.id)}>View Items</button>
                        {/* {(!hide) && <div>
                            <button onClick={handleChoice} name="accept">Accept</button>
                            <button onClick={handleChoice} name="reject">Reject</button>
                        </div>} */}
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

            <h2>Past Orders:</h2>
            <hr />
            {history.map((i) => {
                return (
                    <div>
                        <h2># Order {i.id}</h2>
                        <h3>{i.name}</h3>
                        <h3>{i.status}</h3>
                        <h3>₹{i.total_price}</h3>
                        <h3>{i.order_at}</h3>
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

export default RestaurantOrders;