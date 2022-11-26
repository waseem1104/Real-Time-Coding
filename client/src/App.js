import {Routes,Route} from "react-router-dom";
import Login from "./component/Login";
import Home from './component/Home';
import { SocketProvider } from './context/SocketContext'
function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
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
