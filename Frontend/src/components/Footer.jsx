import React from "react";
import {Link} from "react-router-dom";
import "../style/footer.css";

function Footer(){

    function toTop(){
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
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
                    <Link to="/restaurantRegister">
                        Work with us
                    </Link>
                </div>
            </div>

            <button className="ftr-top" onClick={toTop}>
                To Top ↑
            </button>
        </footer>
    );
}

export default Footer;