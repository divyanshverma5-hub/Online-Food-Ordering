import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../style/HomeRestaurant.css";
import "../style/HomeRestaurant.css"
import EditFood from "./EditFood";
import { toast } from "react-toastify";
import RestaurantNavbar from "./RestaurantNavbar";
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
            await setData(result.ans);
            await setFood(result.food_list);
        }
        getData();
    }, []);
    async function handleDelete(event) {
        let result = await fetch(`http://localhost:3000/homeRestaurant/delete/${event.target.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data })
        });
        setFood(i =>
            food.filter(i => i.id !== Number(event.target.id))
        );
    }
    function handleEdit(item) {
        setSelectedFood(item);
        setShowEdit(true);
    }
    return (
        <>


            {/* ======= */}
            <RestaurantNavbar isHome={true} />
            <div className="rd-header">
                <div>
                    <h1>{data.restaurant_name}</h1>
                    <p className="rd-subtitle">{data.city}</p>
                </div>
                <div className="rd-stats">
                    <div className="rd-stat-card">
                        <span className="rd-stat-value">{food.length}</span>
                        <span className="rd-stat-label">Menu Items</span>
                        {/* >>>>>>> svj */}
                    </div>
                    <Link to="/addFood" className="rd-add-btn">
                        + Add Food
                    </Link>
                </div>
            </div>
            <div className="rd-page">
                <h2 className="rd-section-title">Your Menu</h2>
                {food.length === 0 && (
                    <p className="rd-empty">You haven't added any dishes yet.</p>
                )}
                <div className="rd-grid">
                    {food.map((i) => (
                        <div className="rd-card" key={i.id}>
                            <div className="rd-card-imgwrap">
                                <img src={i.img_url} alt={i.food_name} />
                                <span className={`rd-vegdot ${i.is_veg ? "veg" : "nonveg"}`}></span>
                            </div>
                            <div className="rd-card-body">
                                <h3>{i.food_name}</h3>
                                <p>{i.description}</p>
                                <div className="rd-card-bottom">
                                    <span className="rd-price">₹{i.price}</span>
                                    <span className={`rd-availability ${i.availability ? "on" : "off"}`}>
                                        {i.availability ? "Available" : "Unavailable"}
                                    </span>
                                </div>
                            </div>
                            <div className="rd-card-actions">
                                <button className="rd-btn-edit" onClick={() => handleEdit(i)}>
                                    Edit
                                </button>
                                <button className="rd-btn-delete" id={i.id} onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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

