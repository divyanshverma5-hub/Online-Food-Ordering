import React, { useEffect, useState } from "react";
import "../style/cart.css"

function Cart() {

    const [data, setData] = useState([])
    const [total, setTotal] = useState([])
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

    useEffect(() => {
        getData();
    }, [])

    // console.log(data)
    // console.log(total)


    function getSum() {
        let sum = 0;
        total.map((i) => {
            sum = sum + (i.price * i.quantity);
        })
        return sum;
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

                            <tr key = {i.id}>
                                <td>{i.food_name}</td>
                                <td>{i.price} x {i.quantity}</td>
                                <td>{i.price * i.quantity}</td>
                            </tr>

                        )
                    })
                }

            </div>
            <h3>Total : {getSum()}</h3>
            <h3>Proceed to Pay</h3>  {/* this will link now with rasorPay */}
        </>

    );
}

export default Cart;