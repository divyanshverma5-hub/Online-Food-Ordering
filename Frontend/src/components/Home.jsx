import { useLocation,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { toast } from "react-toastify";
import "../style/home.css";
import Footer from "./Footer";
import CustomerNavbar from "./CustomerNavbar";
export default function Home(){
    const navigate=useNavigate();
    const location=useLocation();
    const params=new URLSearchParams(location.search);
    const search=params.get("search");
    const [data,setData]=useState([]);
    const [city,setCity]=useState(localStorage.getItem("city") || "New Delhi");
    const [searchData,setSearchData]=useState([]);
    const cities=[
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
    const foodCategories=[
        {label:"Biryani",icon:"🍛"},
        {label:"Pizza",icon:"🍕"},
        {label:"North Indian",icon:"🍲"},
        {label:"South Indian",icon:"🥞"},
        {label:"Desserts",icon:"🍰"},
        {label:"Chinese",icon:"🥡"}
    ];
    function handleDetectedCity(detectedCity){
        setCity(detectedCity);
        localStorage.setItem("city",detectedCity);
        getData(detectedCity);
    }
    async function getData(selectedCity){
        let result=await fetch(`http://localhost:3000/city/${selectedCity}`);
        result=await result.json();
        setData(result.result);
    }
    async function handleCity(event){
        let selectedCity=event.target.value;
        setCity(selectedCity);
        localStorage.setItem("city",selectedCity);
        getData(selectedCity);
    }
    async function getRestaurantBySearch(searchText){
        let result=await fetch(`http://localhost:3000/search?category=${searchText}&city=${city}`);
        result=await result.json();
        setSearchData(result.restaurants);
    }
    useEffect(()=>{
        getData(city);
    },[city]);
    useEffect(()=>{
        if(search){
            getRestaurantBySearch(search);
        }
    },[city,search]);
    function handleLogout(){
        localStorage.removeItem("id");
        localStorage.removeItem("login");
        toast.success("Successfully logged Out");
        navigate("/");
    }
    function scrollToRestaurants(){
        document.getElementById("restaurants-near-you")?.scrollIntoView({
            behavior:"smooth"
        });
    }
    return(
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
            <section className="home-hero">
                <div className="home-hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80"
                        alt="Delicious food"
                    />
                </div>
                <div className="home-hero-content">
                    <h1>
                        Your cravings, <span>delivered.</span>
                    </h1>
                    <p>
                        Experience the authentic flavors of India, curated from the finest kitchens and delivered fresh to your doorstep.
                    </p>
                    <div className="home-hero-actions">
                        <button
                            className="home-explore-btn"
                            onClick={scrollToRestaurants}
                        >
                            Explore Restaurants
                        </button>
                        <button
                            className="home-howitworks"
                            onClick={scrollToRestaurants}
                        >
                            <span className="home-howitworks-icon">▶</span> How it works
                        </button>
                    </div>
                </div>
            </section>
            <div className="home-section">
                <div className="home-section-head">
                    <h2>What's on your mind?</h2>
                </div>
                <div className="home-cat-row">
                    {foodCategories.map(i=>(
                        <button
                            key={i.label}
                            className="home-cat-item"
                            onClick={()=>navigate(`/?search=${encodeURIComponent(i.label)}`)}
                        >
                            <span className="home-cat-circle">{i.icon}</span>
                            <span>{i.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="home-promo">
                <div className="home-promo-inner">
                    <div>
                        <h3>Get 50% OFF</h3>
                        <p>
                            on your first 3 orders. Use code
                            <span className="home-promo-code">
                                SPICERUSH50
                            </span>
                        </p>
                    </div>
                    <button className="home-promo-btn">
                        Claim Offer
                    </button>
                </div>
            </div>            {search &&
                <div className="home-section">
                    <div className="home-search-header">
                        <h2>
                            Restaurants (Serving {search})
                        </h2>
                        <button
                            className="home-search-clear"
                            onClick={()=>navigate("/")}
                        >
                            ❌
                        </button>
                    </div>
                    {searchData.length===0 &&
                        <p className="home-empty">
                            No restaurants found for "{search}" in {city}.
                        </p>
                    }
                    <div className="Allrestaurants">
                        {searchData.map(i=>{
                            return(
                                <div
                                    className="restaurant_card"
                                    key={i.id}
                                >
                                    <div className="restaurant_card-imgwrap">
                                        <img
                                            src={i.img_url}
                                            alt={i.restaurant_name}
                                        />
                                    </div>
                                    <div className="restaurant_card-body">
                                        <h3>{i.restaurant_name}</h3>
                                        <p className="restaurant_card-location">
                                            📍 {i.city}
                                        </p>
                                        <button
                                            className="restaurant_card-open-btn"
                                            onClick={()=>navigate(`/home_to_restaurant_page/${i.id}`)}
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
            <div
                className="home-section"
                id="restaurants-near-you"
            >
                <div className="home-section-head">
                    <h2>Restaurants near you</h2>
                </div>
                {data.length===0 &&
                    <p className="home-empty">
                        No restaurants found in {city} yet.
                    </p>
                }
                <div className="Allrestaurants">
                    {data.map(i=>{
                        return(
                            <div
                                className="restaurant_card"
                                key={i.id}
                            >
                                <div className="restaurant_card-imgwrap">
                                    <img
                                        src={i.img_url}
                                        alt={i.restaurant_name}
                                    />
                                </div>
                                <div className="restaurant_card-body">
                                    <h3>{i.restaurant_name}</h3>
                                    <p className="restaurant_card-location">
                                        📍 {i.city}
                                    </p>
                                    <button
                                        className="restaurant_card-open-btn"
                                        onClick={()=>navigate(`/home_to_restaurant_page/${i.id}`)}
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer/>
        </>
    );
}
