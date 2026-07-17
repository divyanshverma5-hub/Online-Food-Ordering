import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "../style/footer.css";

function Footer(){
    const navigate = useNavigate();
    function toTop(){
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    }

    function handleWork(){
        const role = localStorage.getItem("role");
        if (role == "restaurant"){
            navigate("/homeRestaurant");
        } else{
            navigate("/restaurantLogin");
        }
    }

    return(
        <footer className="ftr">
            <div className="ftr-zigzag"></div>

            <div className="ftr-inner">
                <div className="ftr-col ftr-brand">
                    <span className="ftr-logo">
                        FoodHub
                    </span>
                    <p>
                        Delicious food, delivered fast.
                    </p>
                </div>

                <div className="ftr-col">
                    <h4>
                        Quick Links
                    </h4>
                    <Link to="/">
                        Home
                    </Link>
                    {/* <Link to="/restaurantRegister">
                        Work with us
                    </Link> */}
                    <a onClick={handleWork}>Work with us</a>
                </div>
            </div>

            <button className="ftr-top" onClick={toTop}>
                To Top ↑
            </button>
        </footer>
    );
}

export default Footer;