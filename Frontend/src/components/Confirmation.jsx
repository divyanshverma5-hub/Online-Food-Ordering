import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import CustomerNavbar from "./CustomerNavbar";
import "../style/confirmation.css";

function Confirmation(){

    const[order,setOrder]=useState(null);
    const[dishes,setDishes]=useState([]);
    let customer_id=localStorage.getItem("id");

    async function getOrder(){
        let result=await fetch(`http://localhost:3000/order/details?id=${customer_id}`);
        result=await result.json();
        let orders=result.detail;
        if(!orders || orders.length===0){
            return;
        }
        let latest=orders.reduce((a,b)=>
            new Date(a.order_at)>new Date(b.order_at)?a:b
        );
        setOrder(latest);
        let dishResult=await fetch(`http://localhost:3000/order/seeDishes?id=${latest.id}`);
        dishResult=await dishResult.json();
        setDishes(dishResult.dishes || []);
    }
    useEffect(()=>{
        toast.success("Ordered Successfully");
        getOrder();
    },[]);
    return(
        <>
            <CustomerNavbar isGuest={!localStorage.getItem("id")} />
            <main className="conf-main">
                <div className="conf-hero">
    <img className="conf-hero-img"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkoY8rEOnIwhzxn6YfsUHv5Ufs41rYJdBk75AJu9X6BmCGjW_FPE7hd9-lxs3PV8rkGFbhADT6Tf61r3zoxtb5Lfo_A6FQ-9xHvxjn-MIMtVwBUeJE8mUCt-Mi1PoDSAIUGJDB-jBy1tuKrh9nUxXi_Blo7B6L6EDFf9w_x0p9O-_PXmxlqtclmFhGr2PeaNcfKtAK0oukaZxrollZNxcX_ix2nZYro81p0WKjP1dQ9V1zpeEeKJwQ"
        alt="Order Confirmed"/>
</div>
                <h1 className="conf-title">
                    Order placed successfully!
                </h1>
                <p className="conf-sub">
                    Sit back and relax! Your delicious meal is on its way.
                </p>
                {order &&
                    <div className="conf-id">
                        ORDER ID: <b>#{order.id}</b>
                    </div>
                }
                <div className="conf-card">
                    <div className="conf-card-head">
                        <h2>
                            Order Summary
                        </h2>
                        {order &&
                            <span>
                                <span className="material-symbols-outlined">
                                    restaurant
                                </span>
                                {order.restaurant_name}
                            </span>
                        }
                    </div>
                    <div className="conf-items">
                        {dishes.map((d,i)=>
                            <div className="conf-item" key={i}>
                                <div>
                                    <p className="conf-item-name">
                                        {d.food_name} × {d.quantity}
                                    </p>
                                </div>

                                <span>
                                    ₹{d.price_at_purchase*d.quantity}
                                </span>
                            </div>
                        )}
                    </div>
                    {order &&
                        <div className="conf-total-row">
                            <span>
                                Total Paid
                            </span>

                            <span className="conf-total-amt">
                                ₹{order.total_price}
                            </span>
                        </div>
                    }
                </div>
                <div className="conf-actions">
                    <Link className="conf-btn solid" to="/orders">
                        <span className="material-symbols-outlined">
                            local_shipping
                        </span>
                        Track Order
                    </Link>
                    <Link className="conf-btn outline" to="/">
                        Back to Home
                    </Link>
                </div>
                <p className="conf-quote">
                    "Good food is the foundation of genuine happiness."
                </p>
            </main>
        </>
    );
}

export default Confirmation;