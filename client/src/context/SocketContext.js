import React, {createContext,useContext,useRef,useEffect,useState, useMemo} from 'react';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const [isConnected, setConnected] = useState(false)
    const cookies = new Cookies();
    const socket = useMemo(
        () => io("ws://localhost:5000",{
            auth: {
                token: cookies.get('token')
            }
        })
        , []);
    // let socket = useRef(null)

    // useEffect( () => {
    //     const cookies = new Cookies();
    //     if (!isConnected) {
    //         socket = io("ws://localhost:5000",{
    //             auth: {
    //                 token: cookies.get('token')
    //             }
    //         })
    //     }

    //     socket.on('connect', () => {
    //         console.info(`Successfully connected !`)
    //         setConnected(true)
    //     })
    // },[])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

}
export const useSocket = () => useContext(SocketContext)