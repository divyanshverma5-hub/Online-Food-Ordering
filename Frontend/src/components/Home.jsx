import { Link, useNavigate } from "react-router-dom"
import Footer from "./Footer";
import { useEffect, useState } from "react";

import "../style/home.css"
import Home_to_restaurant_page from "./Home_to_restaurant_page";

export default function Home() {

    const cities = [
        "Almora",
        "New Delhi",
        "Mumbai",
        "Bengaluru",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Jaipur",
        "Lucknow",
        "Gwalior"
    ];

    async function getData(selectedCity) {
        let result = await fetch(`http://localhost:3000/city/${selectedCity}`)
        result = await result.json();

        setData(result.result);
    }

    async function handleCity(event) {
        let selectedCity = event.target.value;
        // console.log(event.target.value);

        setCity(selectedCity);
        localStorage.setItem("city", selectedCity)
        getData(selectedCity);
    }


    const [data, setData] = useState([]);
    const [city, setCity] = useState(
        localStorage.getItem("city") || "New Delhi"
    );
    // const city = localStorage.getItem("city") || "New Delhi";
    const navigate = useNavigate();


    useEffect(() => {
        getData(city);
    }, [])


    // console.log(data)
    return (
        <>
            <h1>Home Page</h1>
            <Link to="/login">Login</Link>
            <Link to="/registeration">Register</Link>
            <select onChange={handleCity} value={city}>
                {cities.map(i => <option value={i}>{i}</option>)}
            </select >
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <h1>Display Restaurants</h1>
            <div className="Allrestaurants">
                {data.map(i => {
                    return (
                        <div className="restaurant_card">
                            <h3>{i.restaurant_name}</h3>
                            <img src={i.img_url} alt={i.restaurant_name} />
                            <button onClick={()=> navigate(`/home_to_restaurant_page/${i.id}`)}>Open</button>
                            
                            {/* later add the option of open/close(by comparing his closing time with current time) */}
                        </div>)
                })}
            </div>
            <Footer />

        </>
    );
}