import {Routes,Route} from "react-router-dom";
import Login from "./component/Login";
import Home from './component/Home';
function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </>
    )

}
export default App;
