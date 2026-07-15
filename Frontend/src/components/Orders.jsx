import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import "../style/orders.css"

function Orders() {
    let customer_id = localStorage.getItem("id");
    const [detail, setDetail] = useState([]);
    const [dishesMap, setDishesMap] = useState({});
    const [tab, setTab] = useState("ongoing");
    useEffect(() => {
        let getData = async () => {
            let result = await fetch(`http://localhost:3000/order/details?id=${customer_id}`);
            result = await result.json();
            setDetail(result.detail);
            let map = {};
            for (let order of result.detail) {
                let dishResult = await fetch(`http://localhost:3000/order/seeDishes?id=${order.id}`);
                dishResult = await dishResult.json();
                map[order.id] = dishResult.dishes;
            }
            setDishesMap(map);
        }
        getData();
    }, [])

    let pending = detail.filter((i) => i.status !== "Delivered" && i.status !== "Rejected");
    let history = detail.filter((i) => i.status === "Delivered" || i.status === "Rejected");

    function statusClass(status) {
        if (status === "Delivered") return "badge badge-delivered";
        if (status === "Out for delivery") return "badge badge-transit";
        if (status === "Rejected") return "badge badge-rejected";
        return "badge badge-preparing";
    }

    function formatMeta(order) {
        let date = new Date(order.order_at);
        let today = new Date();
        let isToday = date.toDateString() === today.toDateString();
        let time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        let day = isToday ? "Today" : date.toLocaleDateString();
        return `${day},${time} •#SR-${order.id}`;
    }

    function OrderCard({ order }) {
        let dishes = dishesMap[order.id] || [];

        return (
            <div className="order-card">
                <div className="order-card-top">
                    <div>
                        <h2>{order.restaurant_name}</h2>
                        <p className="order-meta">{formatMeta(order)}</p>
                    </div>
                    <span className={statusClass(order.status)}>{order.status}</span>
                </div>

                <div className="order-items">
                    {dishes.map((d, idx) => (
                        <div className="order-item-row" key={idx}>
                            <span>{d.quantity}x {d.food_name}</span>
                            <span>₹{d.price_at_purchase}</span>
                        </div>
                    ))}
                </div>

                <div className="order-card-bottom">
                    <div>
                        <p className="order-total-label">Total Amount</p>
                        <p className="order-total-amount">₹{order.total_price}</p>
                    </div>
                    <button className="view-details-btn">View Details</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <CustomerNavbar />

            <div className="orders-page">

                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p className="orders-subtitle">Manage and track your delicious spice journey.</p>
                </div>

                <div className="orders-tabs">
                    <button
                        className={tab === "ongoing" ? "tab active" : "tab"}
                        onClick={() => setTab("ongoing")}
                    >
                        Ongoing Orders
                    </button>
                    <button
                        className={tab === "past" ? "tab active" : "tab"}
                        onClick={() => setTab("past")}
                    >
                        Past Orders
                    </button>
                </div>

                <div className="orders-grid">
                    {tab === "ongoing" && (
                        pending.length === 0
                            ? <p className="empty-orders">No ongoing orders.</p>
                            : pending.map((i) => <OrderCard order={i} key={i.id} />)
                    )}

                    {tab === "past" && (
                        history.length === 0
                            ? <p className="empty-orders">No past orders yet.</p>
                            : history.map((i) => <OrderCard order={i} key={i.id} />)
                    )}
                </div>

            </div>
        </>
    )
}

export default Orders