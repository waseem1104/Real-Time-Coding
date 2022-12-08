import {Routes,Route} from "react-router-dom";
import Login from "./component/front/Login";
import Home from './component/front/Home';
import Admin from "./component/admin/Admin";
import CreateRoom from "./component/admin/room/CreateRoom";
import ListRooms from "./component/front/room/ListRooms";
import Chat from "./component/front/chat/Chat";
import { SocketProvider } from './context/SocketContext'
import './App.css'
function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/admin/room/new" element={
                    <SocketProvider>
                        <CreateRoom/>
                    </SocketProvider>
                }/>
                <Route path="/rooms" element={
                    <SocketProvider>
                        <ListRooms/>
                    </SocketProvider>
                }/>
                <Route path="/login" element={
                    <Login/>
                }/>

                <Route path="/chat" element={
                    <SocketProvider>
                        <Chat/>   
                    </SocketProvider>    
                }/>
            </Routes>
        </>
    )

}
export default App;
