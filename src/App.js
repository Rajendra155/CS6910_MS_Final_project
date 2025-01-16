import React from 'react';
import Authentication from './components/Authentication.js'
import ThankYou from './components/ThankYou.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticationWrapper from './components/AuthenticationWrapper';
import './index.css';
import Board from './components/Board.js'
import OTPauthentication from './components/OTPauthentication.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmail from './components/verifyEmail.js';
import Verify from './components/Verify.js';

function App(){

    return(

    
    <div>

<ToastContainer />

    <Router>
        <Routes>
           <Route path="/thankyou" element={<ThankYou />}></Route>
           <Route path="/otp" element={<OTPauthentication />}></Route>
           <Route path="/" element={<AuthenticationWrapper />} ></Route>
           <Route path="/board" element={<Board />}></Route>
           <Route path="/verify-email/:token" element ={<VerifyEmail />}></Route>
           <Route path="/verify" element={<Verify />}></Route>
            
        </Routes>
        </Router>
    </div>
    )
}

export default App;