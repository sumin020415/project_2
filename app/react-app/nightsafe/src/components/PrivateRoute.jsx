import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
