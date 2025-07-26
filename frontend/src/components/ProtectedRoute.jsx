import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, authRoles }) {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const role = localStorage.getItem("ROLE");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!authRoles || authRoles.includes(role)) {
        return children;
    }

    return <Navigate to="/login" />;
}

export default ProtectedRoute;