import React from "react";
import { useEffect, useState } from "react";
function HomeRestaurant(){

    const [data, setData] = useState([]);

    useEffect(()=>{
        let getData = async ()=>{
            let id = localStorage.getItem("id");
            let result = await fetch(`http://localhost:3000/homeRestaurant?id=${id}`);
            result = await result.json();
            console.log(result);
            await setData(result.ans)
        }
        getData();
        
    },[])

    // console.log(data);
    return(
        <>
        <h1>Home page for each restaurant</h1>
        <p>{data.owner_name}</p>
        <h3>City: {data.city}</h3>
        </>
    );
}

export default HomeRestaurant;