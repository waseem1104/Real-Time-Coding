import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();

    if (auth.user.success === false) {
        return <Navigate to='/login' state={{ path: location.pathname }} />
    }
    return children;
}