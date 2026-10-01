import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../style/HomeRestaurant.css";

import EditFood from "./EditFood";
import RestaurantNavbar from "./RestaurantNavbar";

import { toast } from "react-toastify";
import { API_BASE } from "../config";

function HomeRestaurant() {

    const navigate = useNavigate();

    const [showEdit, setShowEdit] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const [data, setData] = useState([]);
    const [food, setFood] = useState([]);

    async function getData() {

        const id = localStorage.getItem("id");

        let result = await fetch(
            `${API_BASE}/homeRestaurant?id=${id}`
        );

        result = await result.json();

        setData(result.ans);
        setFood(result.food_list);
    }

    useEffect(() => {
        getData();
    }, []);

    function handleEdit(item) {
        setSelectedFood(item);
        setShowEdit(true);
    }

    const grouped = food.reduce((acc, item) => {

        const category = item.category || "Other";

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(item);

        return acc;

    }, {});

    async function handleAvailability(food_id, currentAvailability) {

        try {

            const result = await fetch(
                `${API_BASE}/homeRestaurant/availability`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        food_id: food_id,
                        availability: !currentAvailability
                    })
                }
            );

            const data = await result.json();

            if (!data.success) {
                console.log(data.msg);
                return;
            }

            getData();

        } catch (error) {
            console.error("Error changing availability:", error);
        }
    }

    return (
        <>
            <RestaurantNavbar isHome={true} />

            <div className="rd-header">

                <div>
                    <h1>
                        {data.restaurant_name}
                    </h1>

                    <p className="rd-subtitle">
                        {data.city}
                    </p>
                </div>

                <div className="rd-stats">

                    <div className="rd-stat-card">

                        <span className="rd-stat-value">
                            {food.length}
                        </span>

                        <span className="rd-stat-label">
                            Menu Items
                        </span>

                    </div>

                    <Link
                        to="/addFood"
                        className="rd-add-btn"
                    >
                        + Add Food
                    </Link>

                </div>

            </div>

            <div className="rd-page">

                <h2 className="rd-section-title">
                    Your Menu
                </h2>

                {food.length === 0 && (
                    <p className="rd-empty">
                        You haven't added any dishes yet.
                    </p>
                )}

                {Object.entries(grouped).map(([category, items]) => (

                    <div
                        key={category}
                        className="rd-category-block"
                    >

                        <div className="rd-category-head">

                            <h3>
                                {category}
                            </h3>

                            <span className="rd-category-count">
                                {items.length}
                            </span>

                        </div>

                        <div className="rd-grid">

                            {items.map((item) => (

                                <div
                                    key={item.id}
                                    className={`rd-card ${!item.availability
                                        ? "rd-card-unavailable"
                                        : ""
                                        }`}
                                >

                                    <div className="rd-card-imgwrap">

                                        <img
                                            src={item.img_url}
                                            alt={item.food_name}
                                        />

                                        <span
                                            className={`rd-vegdot ${item.is_veg
                                                ? "veg"
                                                : "nonveg"
                                                }`}
                                        ></span>

                                    </div>

                                    <div className="rd-card-body">

                                        <h3>
                                            {item.food_name}
                                        </h3>

                                        <p>
                                            {item.description}
                                        </p>

                                        <div className="rd-card-bottom">

                                            <span className="rd-price">
                                                ₹{item.price}
                                            </span>

                                            <span
                                                className={`rd-availability ${item.availability
                                                    ? "on"
                                                    : "off"
                                                    }`}
                                            >
                                                {item.availability
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="rd-card-actions">

                                        <button
                                            className="rd-btn-edit"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={
                                                item.availability
                                                    ? "rd-btn-toggle-off"
                                                    : "rd-btn-toggle-on"
                                            }
                                            onClick={() =>
                                                handleAvailability(
                                                    item.id,
                                                    item.availability
                                                )
                                            }
                                        >
                                            {item.availability
                                                ? "Make Unavailable"
                                                : "Make Available"}
                                        </button>

                                    </div>

                                </div>

                            ))}

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