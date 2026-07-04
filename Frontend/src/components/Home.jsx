import {Link} from "react-router-dom"
import Footer from "./Footer";

export default function Home(){
    return(
        <>
        <h1>Home Page</h1>
        <Link to="/login">Login</Link>
        <Link to="/registeration">Register</Link>

        <Footer/>
        
        </>
    );
}