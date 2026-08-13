import React, { useEffect, useState } from "react";

import "../style/orders.css";

import CustomerNavbar from "./CustomerNavbar";

// import { toast } from "react-toastify";
// import { getSocket } from "../utils/socket";

function Orders() {
    const customer_id = localStorage.getItem("id");

    const [detail, setDetail] = useState([]);
    const [dishesMap, setDishesMap] = useState({});
    const [tab, setTab] = useState("ongoing");

    async function getData() {

        let result = await fetch(
            `http://localhost:3000/order/details?id=${customer_id}`
        );

        result = await result.json();

        setDetail(result.detail);

        let map = {};

        for (let order of result.detail) {

            let dishResult = await fetch(
                `http://localhost:3000/order/seeDishes?id=${order.id}`
            );

            dishResult = await dishResult.json();

            map[order.id] = dishResult.dishes;

        }

        setDishesMap(map);

    }

    // useEffect(() => {

    //     const socket = getSocket();
    //     console.log("ORDERS PAGE SOCKET:", socket?.id);
    //     if (!socket) return;

    //     const handleStatusUpdate = (data) => {

    //         console.log("ORDER STATUS UPDATED:", data);

    //         toast.info(
    //             `Order #${data.orderId} is now ${data.status}`
    //         );

    //         getData();

    //     };

    //     socket.on("order-status-updated", handleStatusUpdate);

    //     return () => {

    //         socket.off("order-status-updated", handleStatusUpdate);

    //     };

    // }, []);

    useEffect(() => {
        getData();
    }, []);


    const pending = detail.filter(
        (order) =>
            order.status !== "Delivered" &&
            order.status !== "Rejected"
    );

    const history = detail.filter(
        (order) =>
            order.status === "Delivered" ||
            order.status === "Rejected"
    );

    function statusClass(status) {
        if (status === "Delivered") {
            return "badge badge-delivered";
        }

        if (status === "Out for delivery") {
            return "badge badge-transit";
        }

        if (status === "Rejected") {
            return "badge badge-rejected";
        }

        return "badge badge-preparing";
    }

    function formatMeta(order) {
        const date = new Date(order.order_at);
        const today = new Date();

        const isToday =
            date.toDateString() === today.toDateString();

        const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const day = isToday
            ? "Today"
            : date.toLocaleDateString();

        return `${day}, ${time} • #SR-${order.id}`;
    }

    function OrderCard({ order }) {
        const dishes = dishesMap[order.id] || [];

        const [open, setOpen] = useState(false);

        return (
            <div className="order-card">
                <div className="order-card-top">
                    <div>
                        <h2>{order.restaurant_name}</h2>

                        <p className="order-meta">
                            {formatMeta(order)}
                        </p>
                    </div>

                    <span className={statusClass(order.status)}>
                        {order.status}
                    </span>
                </div>

                <div
                    className={
                        open
                            ? "order-items order-items-open"
                            : "order-items order-items-closed"
                    }
                >
                    {dishes.map((dish, index) => (
                        <div
                            key={index}
                            className="order-item-row"
                        >
                            <span>
                                {dish.quantity}x {dish.food_name}
                            </span>

                            <span>
                                ₹{dish.price_at_purchase}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="order-card-bottom">
                    <div>
                        <p className="order-total-label">
                            Total Amount
                        </p>

                        <p className="order-total-amount">
                            ₹{order.total_price}
                        </p>
                    </div>

                    <button
                        className="view-details-btn"
                        onClick={() => setOpen(!open)}
                    >
                        {open
                            ? "Hide Details"
                            : "View Details"}

                        <span
                            className={
                                open
                                    ? "view-details-chevron open"
                                    : "view-details-chevron"
                            }
                        >
                            ▾
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <CustomerNavbar />

            <div className="orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>

                    <p className="orders-subtitle">
                        Manage and track your delicious
                        spice journey.
                    </p>
                </div>

                <div className="orders-tabs">
                    <button
                        className={
                            tab === "ongoing"
                                ? "tab active"
                                : "tab"
                        }
                        onClick={() => setTab("ongoing")}
                    >
                        Ongoing Orders
                    </button>

                    <button
                        className={
                            tab === "past"
                                ? "tab active"
                                : "tab"
                        }
                        onClick={() => setTab("past")}
                    >
                        Past Orders
                    </button>
                </div>

                <div className="orders-grid">
                    {tab === "ongoing" &&
                        (pending.length === 0 ? (
                            <p className="empty-orders">
                                No ongoing orders.
                            </p>
                        ) : (
                            pending.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                />
                            ))
                        ))}

                    {tab === "past" &&
                        (history.length === 0 ? (
                            <p className="empty-orders">
                                No past orders yet.
                            </p>
                        ) : (
                            history.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                />
                            ))
                        ))}
                </div>
            </div>
        </>
    );
}

export default Orders;

// =======
//     useEffect(() => {
//         async function getData() {
//             let result = await fetch(
//                 `http://localhost:3000/order/details?id=${customer_id}`
//             );

//             result = await result.json();

//             setDetail(result.detail);

//             const map = {};

//             for (const order of result.detail) {
//                 let dishResult = await fetch(
//                     `http://localhost:3000/order/seeDishes?id=${order.id}`
//                 );

//                 dishResult = await dishResult.json();

//                 map[order.id] = dishResult.dishes;
//             }

//             setDishesMap(map);
//         }
// >>>>>>> svj

//         getData();
//     }, []);