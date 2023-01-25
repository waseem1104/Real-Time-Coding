import {useState, createContext, useContext, useEffect, Fragment} from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext(null);
const request = new XMLHttpRequest();
export const AuthProvider = ({ children }) => {

    const cookies = new Cookies();
    const [user, setUser] = useState(null);

    useEffect(() => {

        const check = async () => {
            request.open("GET", 'http://localhost:5000/user/checkUser', false);
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Authorization", "Bearer " + cookies.get('token'));
            request.send();


            if (request.response !== 'Unauthorized' && JSON.parse(request.response).success !== false) {
                login(JSON.parse(request.response));
            }else{
                login({success:false});
            }
        }
        
        check();
    }, [children]);

    const login = user => {
        setUser(user);
    }

    const logout = () => {
        setUser({success:false});
        cookies.remove('token', { path: '/' });
    }

    return (
        <Fragment>
            { user ?  
                <AuthContext.Provider value={{ user, login, logout }}>
                    {children}
                </AuthContext.Provider> : "" 
            }
        </Fragment>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}