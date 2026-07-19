import { Link, useLocation, useNavigate } from "react-router-dom"
import Footer from "./Footer";
import { useEffect, useState } from "react";

import "../style/home.css"
import Home_to_restaurant_page from "./Home_to_restaurant_page";
import { toast } from "react-toastify";
import CustomerNavbar from "./CustomerNavbar";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
export default function Home() {
    const navigate = useNavigate();
    const location = useLocation()

    const params = new URLSearchParams(location.search);
    const search = params.get("search");

    function handleDetectedCity(detectedCity) {
        setCity(detectedCity);
        localStorage.setItem("city", detectedCity);
        getData(detectedCity);
    }

    const cities = [
        "Almora",
        "New Delhi",
        "Mumbai",
        "Mathura",
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
        setCity(selectedCity);
        localStorage.setItem("city", selectedCity)
        getData(selectedCity);
    }

    const [data, setData] = useState([]);
    const [city, setCity] = useState(
        localStorage.getItem("city") || "New Delhi"
    );
    const [searchData, setSearchData] = useState([])
    // const city = localStorage.getItem("city") || "New Delhi";

    async function getRestaurantBySearch(searchText) {
        let pendingSearch = localStorage.getItem("pendingSearch")
        let result = await fetch(`http://localhost:3000/search?category=${searchText}&city=${city}`)
        result = await result.json()

        setSearchData(result.restaurants);
    }

    useEffect(() => {
        getData(city);
    }, [city])

    useEffect(() => {
        if (search) {
            getRestaurantBySearch(search);
        }
    }, [city, search]);

    function handleLogout() {
        localStorage.removeItem("id")
        localStorage.removeItem("login")
        toast.success("Successfully logged Out")
        navigate("/")
    }

    return (
        <>
            <CustomerNavbar
                cities={cities}
                city={city}
                handleCity={handleCity}
                isHome={true}
                isGuest={!localStorage.getItem("id")}
                setSearchData={setSearchData}
                handleDetectedCity={handleDetectedCity}
            />

            {search && <>
            <div style={{display:"flex", justifyContent:"center"}}>
                <h1>Restaurants (Serving {search})</h1>
                <button onClick={()=>navigate("/")}>❌</button>
            </div>
                <div className="Allrestaurants">
                    {searchData.map(i => {
                        return (
                            <div className="restaurant_card">
                                <h3>{i.restaurant_name}</h3>
                                <img src={i.img_url} alt={i.restaurant_name} />
                                <button onClick={() => navigate(`/home_to_restaurant_page/${i.id}`)}>Open</button>

                                {/* later add the option of open/close(by comparing his closing time with current time) */}
                            </div>)
                    })}
                </div>
            </>}


            <h1>Display Restaurants</h1>
            <div className="Allrestaurants">
                {data.map(i => {
                    return (
                        <div className="restaurant_card">
                            <h3>{i.restaurant_name}</h3>
                            <img src={i.img_url} alt={i.restaurant_name} />
                            <button onClick={() => navigate(`/home_to_restaurant_page/${i.id}`)}>Open</button>

                            {/* later add the option of open/close(by comparing his closing time with current time) */}
                        </div>)
                })}
            </div>
            <Footer />

        </>
    );
}