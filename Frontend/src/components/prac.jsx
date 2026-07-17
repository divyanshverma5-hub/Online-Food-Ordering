// <<<<<<< Updated upstream
// import React from "react";
// import {Link,useNavigate} from "react-router-dom";
// import {toast} from "react-toastify";
// import "../style/customerNavbar.css";

// function CustomerNavbar({city,cities,handleCity,isHome,isGuest}){
//     const navigate=useNavigate();
//     function handleLogout(){
//         localStorage.removeItem("id");
//         localStorage.removeItem("login");
//         toast.success("Successfully logged Out");
//         navigate("/");
//     }
//     return(
//         <div className="navbar">
//             <Link to="/" className="nav-brand">
//                 FoodHub
//             </Link>
//             <div className="nav-links">
//                 {!isHome &&
//                     <Link to="/">
//                         Home
//                     </Link>
//                 }
//                 {!isGuest &&
//                     <Link to="/orders">
//                         Orders
//                     </Link>
//                 }
//                 {!isGuest &&
//                     <Link to="/cart">
//                         Cart
//                     </Link>
//                 }
//                 {isHome && cities &&
//                     <select className="nav-city" onChange={handleCity} value={city}>
//                         {cities.map((i)=>
//                             <option key={i} value={i}>
//                                 {i}
//                             </option>
//                         )}
//                     </select>
//                 }
//             </div>
//             <div className="nav-search">
//                 <p>
//                     SearchBar
//                 </p>
//             </div>
//             <div className="nav-right">
//                 {!isGuest &&
//                     <>
//                         <span className="nav-hello">
//                             Hi, {localStorage.getItem("name") || "Customer"}
//                         </span>
// =======
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "../style/customerNavbar.css"

// function CustomerNavbar({ city, cities, handleCity, isHome, isGuest,setSearchData }) {
//     const navigate = useNavigate();
//     const [searchText, setSearchText] = useState("")

//     function handleLogout() {
//         localStorage.removeItem("id")
//         localStorage.removeItem("login")
//         toast.success("Successfully logged Out")
//         navigate("/")
//     }

//     async function SearchButton() {
//         if (searchText == "") {
//             toast.warning("Please write something to search")
//         }
//         let city = localStorage.getItem("city") || "New Delhi"
//         let result = await fetch(`http://localhost:3000/search?category=${searchText}&city=${city}`)
//         result = await result.json();

//         // console.log(result);
//         setSearchData(result.restaurants);
//         navigate("/")
//     }
//     // console.log(searchText);

//     return (
//         <div className="navbar">
//             {!isHome && <Link to="/">Home</Link>}
//             {isHome && isGuest && <Link to="/login">Login</Link>}
//             {isHome && isGuest && <Link to="/registeration">Register</Link>}
//             {!isGuest && <p>Hello, {localStorage.getItem("name") || "Customer"}</p>}
//             {isHome && <select onChange={handleCity} value={city}>
//                 {cities.map(i => <option value={i}>{i}</option>)}
//             </select >}
//             <div>
//                 <input placeholder="Search here..." value={searchText} onChange={() => setSearchText(event.target.value)} />
//                 <button onClick={SearchButton}>Search</button>
//             </div>
//             {!isGuest && <Link to="/cart">Cart</Link>}
//             {!isGuest && <Link to="/orders">Orders</Link>}
//             {!isGuest && <button onClick={handleLogout}>Logout</button>}
//         </div>
//     )
// }
// >>>>>>> Stashed changes

//                         <button className="nav-btn outline" onClick={handleLogout}>
//                             Logout
//                         </button>
//                     </>
//                 }
//                 {isGuest &&
//                     <>
//                         <Link to="/login" className="nav-btn ghost">
//                             Login
//                         </Link>
//                         <Link to="/registeration" className="nav-btn solid">
//                             Signup
//                         </Link>
//                     </>
//                 }
//             </div>
//         </div>
//     );
// }
// export default CustomerNavbar;


// <<<<<<< Updated upstream
// import React,{useEffect,useState} from "react";
// import {useParams} from "react-router-dom";
// import {toast} from "react-toastify";
// import CustomerNavbar from "./CustomerNavbar";
// import "../style/HomeRestaurant.css";
// =======
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import CustomerNavbar from "./CustomerNavbar.jsx"

// function Home_to_restaurant_page() {
//     // const [searchData, setSearchData] = useState([])
//     const { id } = useParams();
//     console.log(id);

//     const [menu, setMenu] = useState([])
//     const [data, setData] = useState([])

//     useEffect(() => {
//         const getData = async () => {
//             let result = await fetch(`http://localhost:3000/details?id=${id}`)
//             result = await result.json();
//             let profile = result.profile;
//             let Menu = result.menu
// >>>>>>> Stashed changes

// function Home_to_restaurant_page(){
//     const{id}=useParams();
//     const[menu,setMenu]=useState([]);
//     const[data,setData]=useState([]);
//     const[search,setSearch]=useState("");
//     useEffect(()=>{
//         const getData=async()=>{
//             let result=await fetch(`http://localhost:3000/details?id=${id}`);
//             result=await result.json();
//             let profile=result.profile;
//             let Menu=result.menu;
//             setData(profile);
//             setMenu(Menu);
//         }
//         getData();
//     },[]);
//     async function handleAdd(food_id){
//         let customer_id=localStorage.getItem("id");
//         let result=await fetch("http://localhost:3000/addToCart",{
//             method:"POST",
//             credentials:"include",
//             headers:{"Content-Type":"application/json"},
//             body:JSON.stringify({food_id,customer_id})
//         });
//         result=await result.json();
//         if(result.success){
//             toast.success(result.msg);
//         }
//         else{
//             toast.error(result.msg);
//         }
//     }
//     const filteredMenu=menu.filter((i)=>
//         i.food_name.toLowerCase().includes(search.toLowerCase())
//     );
//     const categories=[...new Set(filteredMenu.map((i)=>i.category))];
//     return(
//         <>
// <<<<<<< Updated upstream
//             <CustomerNavbar isGuest={!localStorage.getItem("id")} />
//             <div className="rhero" style={{backgroundImage:`url(${data.img_url})`}}>
//                 <div className="rhero-overlay">
//                     <h1>{data.restaurant_name}</h1>
//                     <p>{data.location}</p>
//                 </div>
//             </div>
//             <div className="rpage">
//                 <aside className="rside">
//                     <input
//                         className="rsearch"
//                         placeholder="Search within menu"
//                         value={search}
//                         onChange={(e)=>setSearch(e.target.value)}
//                     />
//                     <nav className="rcatnav">
//                         {categories.map((c)=>
//                             <a key={c} href={`#${c}`}>
//                                 {c}
//                             </a>
//                         )}
//                     </nav>
//                 </aside>
//                 <main className="rmain">
//                     {categories.map((cat)=>
//                         <section key={cat} id={cat}>
//                             <h2 className="rsection-title">
//                                 {cat}
//                             </h2>
//                             <div className="menuCard">
//                                 {filteredMenu.filter((i)=>i.category===cat).map((i)=>
//                                     <div className="box" key={i.id}>
//                                         <div className="box-info">
//                                             <span className={`vegdot ${i.is_veg?"veg":"nonveg"}`}></span>
//                                             <h3>
//                                                 {i.food_name}
//                                             </h3>
//                                             <p>
//                                                 {i.description}
//                                             </p>
//                                             <span className="price">
//                                                 ₹{i.price}
//                                             </span>
//                                         </div>
//                                         <div className="box-imgwrap">
//                                             <img src={i.img_url} alt={i.food_name} />
//                                             <button onClick={()=>handleAdd(i.id)}>
//                                                 ADD
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>
//                     )}
//                 </main>
// =======
//             <CustomerNavbar/>
//             <h1>{data.restaurant_name}</h1>
//             <h1>Menu</h1>
//             <div className="menuCard">

//                 {menu.map((i) => (
//                     <div className="box">

//                         <img src={i.img_url} alt={i.food_name} />

//                         <div>
//                             <h2>{i.food_name}</h2>
//                             <p>{i.description}</p>
//                             <h3>₹{i.price}</h3>

//                             <button onClick={()=>handleAdd(i.id)}>Add</button>

//                         </div>

//                     </div>
//                 ))}

// >>>>>>> Stashed changes
//             </div>
//         </>
//     );
// }

// export default Home_to_restaurant_page;
