import React, { useEffect, useState } from "react";
import "../style/cart.css"
import { Link } from "react-router-dom";

function Cart() {

    const [data, setData] = useState([])
    const [total, setTotal] = useState([])
    const [address, setAddress] = useState("")
    const [off1, setOff] = useState(true);
    let customer_id = localStorage.getItem("id");

    let getData = async () => {
        let result = await fetch(`http://localhost:3000/cart_menu?customer_id=${customer_id}`);
        result = await result.json();
        setData(result.food)
        setTotal(result.total)
    }

    async function handleQuantity(event, food_id, qty) {
        let sign = event.target.name;

        let result = await fetch(`http://localhost:3000/cart/quantity`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sign, food_id, qty })
        });

        await getData();
    }

    async function handleOrder() {
        let restaurant_id= data[0].restaurant_id;
        let result = await fetch("http://localhost:3000/checkout", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ amount: getSum(), customer_id, restaurant_id, address })
        })
        result = await result.json();
        const { order } = result;

        result = await fetch("http://localhost:3000/razor_key");
        result = await result.json();
        const { key } = result;

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Restaurant name",
            description: "Payment for ordering food online",
            image: "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=",
            order_id: order.id,
            callback_url: "http://localhost:3000/paymentVerification",
            prefill: {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "+919876543210"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#3399cc"
            }
        };
        const razor = new Razorpay(options);
        razor.open();
    }

    useEffect(() => {
        getData();
    }, [])

    console.log(data)
    console.log(total)


    function getSum() {
        let sum = 0;
        total.map((i) => {
            sum = sum + (i.price * i.quantity);
        })
        return sum;
    }
    async function handleAddress(event) {
        let name = event.target.value;
        await setAddress(name);

        if (name != "") {
            setOff(false);
        } else {
            setOff(true);
        }
    }

    return (
        <>
            <h1>Cart</h1>
            {data.map((i) => (
                <div className="box" key={i.id}>

                    <img src={i.img_url} alt={i.food_name} />

                    <div>
                        <h2>{i.food_name}</h2>
                        <p>{i.description}</p>
                        <h3>₹{i.price}</h3>

                        <div style={{ display: "flex" }}>
                            <button onClick={(event) => handleQuantity(event, i.id, i.quantity)} name='-'>-</button>
                            <h3>{i.quantity}</h3>
                            <button onClick={(event) => handleQuantity(event, i.id, i.quantity)} name='+'>+</button>
                        </div>

                    </div>

                </div>
            ))}

            <div className="total">
                <h2>Final Bill</h2>
                <tr>
                    <td>Item</td>
                    <td>Quantity</td>
                    <td>Price</td>
                </tr>
                {
                    total.map((i) => {
                        return (

                            <tr key={i.id}>
                                <td>{i.food_name}</td>
                                <td>{i.price} x {i.quantity}</td>
                                <td>{i.price * i.quantity}</td>
                            </tr>

                        )
                    })
                }

            </div>
            <h3>Total : {getSum()}</h3>
            {/* <Link to={"/cart/confirmation"}>Place Order</Link> */}
            <input placeholder="Fill Address Before Proceeding*" value={address} onChange={handleAddress} />

            <button onClick={handleOrder} disabled={off1}>Place Order</button>
        </>

    );
}

export default Cart;