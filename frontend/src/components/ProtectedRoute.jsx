import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute() {
    const { isLogged } = useUser();
    const location = useLocation();

    if (!isLogged) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
