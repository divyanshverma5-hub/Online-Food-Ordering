import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomerNavbar from "./CustomerNavbar";
import "../style/restaurantMenuPage.css";
function Home_to_restaurant_page(){

    const { id } = useParams();

    const [menu, setMenu] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        const getData = async () => {
            let result = await fetch(`http://localhost:3000/details?id=${id}`,{
                credentials: "include"
            });
            result = await result.json();

            let profile = result.profile;
            let Menu = result.menu;

            setData(profile);
            setMenu(Menu);
        }

        getData();
    }, []);

    async function handleAdd(food_id){

        let customer_id = localStorage.getItem("id");
        if (!customer_id){
            toast.error("Login to add items.")
        }
        else{
            let result = await fetch("http://localhost:3000/addToCart", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ food_id })
            });
            result = await result.json();
            if (result.success) {
                toast.success(result.msg);
            }
            else {
                toast.error(result.msg);
            }
        }
    }

    const filteredMenu = menu.filter((i) =>
        i.food_name.toLowerCase().includes(search.toLowerCase())
    );

    const categories = [...new Set(filteredMenu.map((i) => i.category))];

    return(
        <>
            <CustomerNavbar isGuest={!localStorage.getItem("id")} />
            {/* <CustomerNavbar /> */}

            <div className="rhero" style={{ backgroundImage: `url(${data.img_url})` }}>
                <div className="rhero-overlay">
                    <h1>{data.restaurant_name}</h1>
                    <p>{data.location}</p>
                </div>
            </div>

            <div className="rpage">
                <aside className="rside">
                    <input
                        className="rsearch"
                        placeholder="Search within menu"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <nav className="rcatnav">
                        {categories.map((c) => (
                            <a key={c} href={`#${c}`}>
                                {c}
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="rmain">
                    {categories.map((cat) => (
                        <section key={cat} id={cat}>
                            <h2 className="rsection-title">
                                {cat}
                            </h2>

                            <div className="menuCard">
                                {filteredMenu
                                    .filter((i) => i.category === cat)
                                    .map((i) => (
                                        <div className="box" key={i.id}>
                                            <div className="box-info">
                                                <span className={`vegdot ${i.is_veg ? "veg" : "nonveg"}`}></span>

                                                <h3>
                                                    {i.food_name}
                                                </h3>

                                                <p>
                                                    {i.description}
                                                </p>

                                                <span className="price">
                                                    ₹{i.price}
                                                </span>
                                            </div>

                                            <div className="box-imgwrap">
                                                <img src={i.img_url} alt={i.food_name} />

                                                <button onClick={() => handleAdd(i.id)}>
                                                    ADD
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    ))}
                </main>
            </div>
        </>
    );
}

export default Home_to_restaurant_page;