import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const IsAdmin = ({ children }) => {
    
    const location = useLocation();
    const auth = useAuth();
    
    if (!auth.user.isAdmin || auth.user.success === false) {

        return <Navigate to='/rooms' state={{ path: location.pathname }} />
    }
    return children;
}