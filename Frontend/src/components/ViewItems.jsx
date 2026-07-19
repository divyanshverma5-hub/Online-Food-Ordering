import React from "react";

function ViewItems({ order, dishes }){
    return(
        <div className="view-items-panel">
            <div>
                <h2>Customer Details</h2>
                <h3>
                    Name: {order.name}
                </h3>
                <h3>
                    Phone: {order.phone}
                </h3>
                <h3>
                    Address: {order.address}
                </h3>
            </div>
            <hr />
            <h2>Item Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dishes.map((i, idx) => {
                            return(
                                <tr key={idx}>
                                    <td>{i.food_name}</td>
                                    <td>₹{i.price_at_purchase}</td>
                                    <td>{i.quantity}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
export default ViewItems;