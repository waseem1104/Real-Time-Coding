import {Routes,Route} from "react-router-dom";
import Login from "./component/front/Login";
import Register from "./component/front/Register";
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
import Request from "./component/front/request/Request";
import RequestAdmin from "./component/admin/request/Request";
import Error404 from "./component/404";
import CustomizeNotification from "./component/admin/sse/CustomizeNotification";

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

                    <Route path="/register" element={
                        <Register/>
                    }/>

                    <Route path="/chat" element={
                        <SocketProvider>
                            <Chat/>   
                        </SocketProvider>    
                    }/>

                    <Route path="/request" element={
                        <RequireAuth>
                            <SocketProvider>
                                <Request/>
                            </SocketProvider>
                        </RequireAuth>
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
                    <Route path="/admin/request" element={
                        <IsAdmin>
                            <SocketProvider>
                                <RequestAdmin/>
                            </SocketProvider>
                        </IsAdmin>
                    }/>

                    <Route path="/admin/send-notification" element={
                        <IsAdmin>
                            <SocketProvider>
                                <CustomizeNotification />
                            </SocketProvider>
                        </IsAdmin>
                    }/>

                    <Route path="*" element={<Error404/>}/>

                </Routes>
            </AuthProvider>
        </>
    )

}
export default App;
