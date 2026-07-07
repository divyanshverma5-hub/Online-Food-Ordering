import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Home_to_restaurant_page() {
    const { id } = useParams();
    console.log(id);

    const [menu, setMenu] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            let result = await fetch(`http://localhost:3000/details?id=${id}`)
            result = await result.json();
            let profile = result.profile;
            let Menu = result.menu
            // console.log(result)

            setData(profile);
            setMenu(Menu)
        }
        getData();

    }, [])
    console.log("data")
    console.log(data)

    return (
        <>
            <h1>{data.restaurant_name}</h1>
            <h1>Menu</h1>
            <div className="menuCard">

                {menu.map((i) => (
                    <div className="box">

                        <img src={i.img_url} alt={i.food_name} />

                        <div>
                            <h2>{i.food_name}</h2>
                            <p>{i.description}</p>
                            <h3>₹{i.price}</h3>

                            <button>Add</button>

                        </div>

                    </div>
                ))}

            </div>
        </>



    )
}

export default Home_to_restaurant_page;