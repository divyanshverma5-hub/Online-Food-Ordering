import React, {useEffect,useState} from "react";
import "../style/cart.css"
import CustomerNavbar from "./CustomerNavbar";

function Cart(){
    const [data,setData]=useState([])
    const [total,setTotal]=useState([])
    const [address,setAddress]=useState("")
    const [off1,setOff]=useState(true)
    const [customerDetail,setCustomerDetail]=useState([])
    let customer_id=localStorage.getItem("id")
    let getData=async()=>{
        let result=await fetch(`http://localhost:3000/cart_menu?customer_id=${customer_id}`)
        result=await result.json()
        setData(result.food)
        setTotal(result.total)
        setCustomerDetail(result.detail)
    }
    async function handleQuantity(event,food_id,qty){
        let sign=event.target.name
        await fetch("http://localhost:3000/cart/quantity",{
            method:"PATCH",
            credentials:"include",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({sign,food_id,qty})
        })
        await getData()
    }
    async function handleOrder(){
        let restaurant_id=data[0].restaurant_id
        let result=await fetch("http://localhost:3000/checkout",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({amount:getSum(),customer_id,restaurant_id,address})
        })
        result=await result.json()
        const {order}=result
        result=await fetch("http://localhost:3000/razor_key")
        result=await result.json()
        const {key}=result
        const options={
            key,
            amount:order.amount,
            currency:"INR",
            name:data[0].restaurant_name,
            description:"Payment for ordering food online",
            order_id:order.id,
            callback_url:"http://localhost:3000/paymentVerification",
            prefill:{
                name:customerDetail.name,
                email:customerDetail.email,
                contact:customerDetail.phone
            },
            theme:{
                color:"#06C167"
            }
        }
        const razor=new Razorpay(options)
        razor.open()
    }
    useEffect(()=>{
        getData()
    },[])
    function getSum(){
        let sum=0
        total.map((i)=>{
            sum=sum+(i.price*i.quantity)
        })
        return sum
    }
    function handleAddress(event){
        let name=event.target.value
        setAddress(name)
        if(name!=""){
            setOff(false)
        }
        else{
            setOff(true)
        }
    }
    return(
        <>
            <CustomerNavbar/>
            <div className="cart-page">
                <div className="cart-header">
                    <h1>My Cart</h1>
                    <p className="cart-subtitle">Review your items before checkout</p>
                </div>
                <div className="cart-card">
                    {data.length==0&&
                        <p className="empty-cart">Your cart is empty</p>
                    }
                    {data.map((i)=>(
                        <div className="cart-item" key={i.id}>
                            <img src={i.img_url} className="item-img"/>
                            <div className="item-info">
                                <h2>{i.food_name}</h2>
                                <p className="item-desc">{i.description}</p>
                            </div>
                            <div className="item-qty">
                                <button className="qty-btn" name="-" onClick={(event)=>handleQuantity(event,i.id,i.quantity)}>-</button>
                                <span className="qty-value">{i.quantity}</span>
                                <button className="qty-btn" name="+" onClick={(event)=>handleQuantity(event,i.id,i.quantity)}>+</button>
                            </div>
                            <div className="item-price">₹{i.price}</div>
                        </div>
                    ))}
                    <div className="bill-section">
                        <h3 className="bill-title">Final Bill</h3>
                        {total.map((i)=>(
                            <div className="bill-row" key={i.id}>
                                <span>{i.food_name} x {i.quantity}</span>
                                <span>₹{i.price*i.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart-footer">
                        <div className="total-block">
                            <p className="total-label">Total Amount</p>
                            <p className="total-amount">₹{getSum()}</p>
                        </div>
                        <input className="address-input" placeholder="Fill Address Before Proceeding*" value={address} onChange={handleAddress}/>
                        <button className="place-order-btn" onClick={handleOrder} disabled={off1}>Place Order</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart