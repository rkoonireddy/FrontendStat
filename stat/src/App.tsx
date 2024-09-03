import React from 'react';
import './App.css';
import HomePage from "./components/pages/HomePage";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Main from "./components/pages/MainPage";


// css
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/main" element={<Main/>}/>
            </Routes>
        </Router>
    );
}

export default App;
