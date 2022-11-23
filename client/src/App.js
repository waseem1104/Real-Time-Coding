import {Routes,Route} from "react-router-dom";
import Login from "./component/Login";
import Home from './component/Home';
import Admin from "./component/Admin";
import CreateRoom from "./component/CreateRoom";
import ListRooms from "./component/ListRooms";
function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/admin/room/new" element={<CreateRoom/>}/>
                <Route path="/rooms" element={<ListRooms/>}/>
            </Routes>
        </>
    )

}
export default App;
