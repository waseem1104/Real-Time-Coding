import {Routes,Route} from "react-router-dom";
import Login from "./component/front/Login";
import Home from './component/front/Home';
import Admin from "./component/admin/Admin";
import CreateRoom from "./component/admin/room/CreateRoom";
import ListRooms from "./component/front/room/ListRooms";
import ChatRoom from "./component/front/room/ChatRoom";
import Chat from "./component/front/chat/Chat";
import { SocketProvider } from './context/SocketContext'
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './component/RequireAuth';
import './App.css'
import Chatbot from "./component/front/chatbot/Chatbot";
import Edit from "./component/admin/room/Edit";
function App() {

    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/admin/room/new" element={
                        <SocketProvider>
                            <CreateRoom/>
                        </SocketProvider>
                    }/>

                    <Route path="/chatbot" element={
                        <RequireAuth>
                            <SocketProvider>
                                <Chatbot/>
                            </SocketProvider>
                        </RequireAuth>
                    }/>
                    <Route path="/admin/room/edit/:id" element={
                        <SocketProvider>
                            <Edit/>
                        </SocketProvider>
                    }/>

                    
                    <Route path="/rooms" element={
                        <RequireAuth>
                            <SocketProvider>
                                <ListRooms/>
                            </SocketProvider>
                        </RequireAuth>
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
            </AuthProvider>
        </>
    )

}
export default App;
