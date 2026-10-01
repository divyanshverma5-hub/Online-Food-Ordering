import { API_BASE } from "../config";
import "../style/restarauntorders.css";

import RestaurantNavbar from "./RestaurantNavbar";
import ViewItems from "./ViewItems";
import { useState, useEffect } from "react";

function RestaurantOrders() {

    const restaurant_id = localStorage.getItem("id");

    const [detail, setDetail] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [show, setShow] = useState("");

    const pending = detail.filter(
        (order) => order.status === "Pending"
    );

    const active = detail.filter(
        (order) =>
            order.status !== "Pending" &&
            order.status !== "Delivered" &&
            order.status !== "Rejected"
    );

    const history = detail.filter(
        (order) =>
            order.status === "Delivered" ||
            order.status === "Rejected"
    );

    async function getData() {

        let result = await fetch(`${API_BASE}/order/restaurant/details?id=${restaurant_id}`, {
            credentials: "include"
        });
        result = await result.json();
        setDetail(result.detail);
    }

    useEffect(() => {
        getData();
    }, []);


    async function seeDishes(order_id) {

        let result = await fetch(`${API_BASE}/order/seeDishes?id=${order_id}`,{
            credentials:"include",
        });

        result = await result.json();

        setDishes(result.dishes);

        if (show === order_id) {
            setShow(null);
        } else {
            setShow(order_id);
        }
    }


    async function handleChoice(choice, order_id) {

        await fetch(`${API_BASE}/order/changeStatus`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                choice,
                order_id
            })
        });
        getData();
    }


    function statusClass(status) {

        if (status === "Delivered") {
            return "r-badge r-badge-delivered";
        }

        if (status === "Rejected") {
            return "r-badge r-badge-rejected";
        }

        if (status === "Pending") {
            return "r-badge r-badge-pending";
        }

        return "r-badge r-badge-active";
    }


    return (
        <>
            <RestaurantNavbar />

            <div className="rorders-page">

                <div className="rorders-header">

                    <h1>Orders</h1>

                    <p className="rorders-subtitle">
                        Manage incoming and ongoing orders
                        for your restaurant.
                    </p>

                </div>

                {/* //new orders */}
                <section className="rorders-section">

                    <div className="rorders-section-title">

                        <span>🟢 New Orders</span>

                        <span className="count-badge">
                            {pending.length}
                        </span>

                    </div>


                    <div className="rorders-grid">

                        {pending.length === 0 && (
                            <p className="empty-orders">
                                No new orders.
                            </p>
                        )}


                        {pending.map((order) => (

                            <div
                                key={order.id}
                                className="rorder-card"
                            >

                                <div className="rorder-card-top">

                                    <div>

                                        <h2>Order #{order.id}</h2>

                                        <p className="rorder-meta">
                                            {order.name} •{" "}
                                            {new Date(
                                                order.order_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    <span
                                        className={statusClass(
                                            order.status
                                        )}
                                    >
                                        {order.status}
                                    </span>

                                </div>


                                <p className="rorder-total">
                                    ₹{order.total_price}
                                </p>


                                <div className="rorder-actions">

                                    <button
                                        className="btn-outline"
                                        onClick={() =>
                                            seeDishes(order.id)
                                        }
                                    >
                                        {show === order.id ? "Hide Details" : "View Details"}
                                    </button>


                                    <button
                                        className="btn-accept"
                                        onClick={() =>
                                            handleChoice(
                                                "Preparing",
                                                order.id
                                            )
                                        }
                                    >
                                        Accept
                                    </button>


                                    <button
                                        className="btn-reject"
                                        onClick={() =>
                                            handleChoice(
                                                "Rejected",
                                                order.id
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>


                                {show === order.id && (
                                    <ViewItems
                                        order={order}
                                        dishes={dishes}
                                    />
                                )}

                            </div>

                        ))}

                    </div>

                </section>


                {/* Active orders */}

                <section className="rorders-section">

                    <div className="rorders-section-title">

                        <span>🟡 Active Orders</span>

                        <span className="count-badge">
                            {active.length}
                        </span>

                    </div>


                    <div className="rorders-grid">

                        {active.length === 0 && (
                            <p className="empty-orders">
                                No active orders.
                            </p>
                        )}


                        {active.map((order) => (

                            <div
                                key={order.id}
                                className="rorder-card"
                            >

                                <div className="rorder-card-top">
                                    <div>
                                        <h2>Order #{order.id}</h2>

                                        <p className="rorder-meta">
                                            {order.name} •{" "}
                                            {new Date(
                                                order.order_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>


                                    <span className={statusClass(order.status)}>
                                        {order.status}
                                    </span>

                                </div>


                                <p className="rorder-total">
                                    ₹{order.total_price}
                                </p>


                                <div className="rorder-actions">

                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(e) =>
                                            handleChoice(
                                                e.target.value,
                                                order.id
                                            )
                                        }
                                    >

                                        <option value="Preparing">
                                            Preparing
                                        </option>

                                        <option value="Ready">
                                            Ready
                                        </option>

                                        <option value="Out for Delivery">
                                            Out for Delivery
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                    </select>


                                    <button
                                        className="btn-outline"
                                        onClick={() =>
                                            seeDishes(order.id)
                                        }
                                    >
                                        {show === order.id ? "Hide Details" : "View Details"}
                                    </button>

                                </div>


                                {show === order.id && (
                                    <ViewItems
                                        order={order}
                                        dishes={dishes}
                                    />
                                )}

                            </div>

                        ))}

                    </div>

                </section>


                {/* Past orders */}

                <section className="rorders-section">

                    <div className="rorders-section-title">
                        <span>Past Orders</span>

                        <span className="count-badge">
                            {history.length}
                        </span>
                    </div>


                    <div className="rorders-grid">

                        {history.length === 0 && (
                            <p className="empty-orders">
                                No past orders yet.
                            </p>
                        )}


                        {history.map((order) => (

                            <div
                                key={order.id}
                                className="rorder-card"
                            >

                                <div className="rorder-card-top">
                                    <div>
                                        <h2>Order #{order.id}</h2>

                                        <p className="rorder-meta">
                                            {order.name} •{" "}
                                            {new Date(
                                                order.order_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span className={statusClass(order.status)}>
                                        {order.status}
                                    </span>

                                </div>


                                <p className="rorder-total">
                                    ₹{order.total_price}
                                </p>


                                <div className="rorder-actions">

                                    <button
                                        className="btn-outline"
                                        onClick={() =>
                                            seeDishes(order.id)
                                        }
                                    >
                                        {show === order.id ? "Hide Details" : "View Details"}
                                    </button>

                                </div>


                                {show === order.id && (
                                    <ViewItems
                                        order={order}
                                        dishes={dishes}
                                    />
                                )}

                            </div>

                        ))}

                    </div>

                </section>

            </div>
        </>
    );
}

export default RestaurantOrders;