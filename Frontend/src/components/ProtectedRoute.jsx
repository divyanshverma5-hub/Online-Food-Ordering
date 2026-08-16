import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

    const userRole = localStorage.getItem("role");

    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== role) {

        if (userRole === "customer") {
            return <Navigate to="/" replace />;
        }

        if (userRole === "restaurant") {
            return <Navigate to="/homeRestaurant" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;