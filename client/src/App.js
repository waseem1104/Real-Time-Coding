import {Routes,Route} from "react-router-dom";
import Login from "./component/front/Login";
import Home from './component/front/Home';
import Admin from "./component/admin/Admin";
import CreateRoom from "./component/admin/room/CreateRoom";
import ListRooms from "./component/front/room/ListRooms";
import { SocketProvider } from './context/SocketContext'
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
            </Routes>
        </>
    )

}
export default App;
