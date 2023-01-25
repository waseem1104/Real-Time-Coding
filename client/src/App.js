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
import { IsAdmin } from './component/IsAdmin';
import './App.css'
import Chatbot from "./component/front/chatbot/Chatbot";
import Edit from "./component/admin/room/Edit";
function App() {

    return (
        <>
            <AuthProvider>
                <Routes>
                    {/* FRONT */}
                    <Route path="/" element={<Home/>}/>

                    <Route path="/login" element={
                        <Login/>
                    }/>

                    <Route path="/chat" element={
                        <SocketProvider>
                            <Chat/>   
                        </SocketProvider>    
                    }/>

                    <Route path="/chatbot" element={
                        <RequireAuth>
                            <SocketProvider>
                                <Chatbot/>
                            </SocketProvider>
                        </RequireAuth>
                    }/>

                    <Route path="/rooms" element={
                        <RequireAuth>
                            <SocketProvider>
                                <ListRooms/>
                            </SocketProvider>
                        </RequireAuth>
                    }/>

                    {/* BACK */}
                    <Route path="/admin" element={
                        <IsAdmin>
                            <Admin/>
                        </IsAdmin>
                    }/>

                    <Route path="/admin/room/new" element={
                        <IsAdmin>
                            <SocketProvider>
                                <CreateRoom/>
                            </SocketProvider>
                        </IsAdmin>
                    }/>

                    <Route path="/admin/room/edit/:id" element={
                        <IsAdmin>
                            <SocketProvider>
                                <Edit/>
                            </SocketProvider>
                        </IsAdmin>
                    }/>

                </Routes>
            </AuthProvider>
        </>
    )

}
export default App;
