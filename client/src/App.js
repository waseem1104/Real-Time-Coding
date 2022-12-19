import {Routes,Route} from "react-router-dom";
import Login from "./component/front/Login";
import Home from './component/front/Home';
import Admin from "./component/admin/Admin";
import CreateRoom from "./component/admin/room/CreateRoom";
import ListRooms from "./component/front/room/ListRooms";
import ChatRoom from "./component/front/room/ChatRoom";
import Chat from "./component/front/chat/Chat";
import { SocketProvider } from './context/SocketContext'
import './App.css'
import Edit from "./component/admin/room/Edit";
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

                <Route path="/admin/room/edit/:id" element={
                    <SocketProvider>
                        <Edit/>
                    </SocketProvider>
                }/>

                
                <Route path="/rooms" element={
                    <SocketProvider>
                        <ListRooms/>
                    </SocketProvider>
                }/>

                {/* <Route path="/room/:id" element={
                    <SocketProvider>
                        <ChatRoom/>
                    </SocketProvider>
                }/> */}

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
