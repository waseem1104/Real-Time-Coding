import {Routes,Route} from "react-router-dom";
import Login from "./component/Login";
import Home from './component/Home';
import Admin from "./component/Admin";
import CreateRoom from "./component/CreateRoom";
import ListRooms from "./component/ListRooms";
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
                <Route path="/rooms" element={<ListRooms/>}/>
                <Route path="/login" element={
                    <SocketProvider>
                        <Login/>
                    </SocketProvider>
                }/>
            </Routes>
        </>
    )

}
export default App;
