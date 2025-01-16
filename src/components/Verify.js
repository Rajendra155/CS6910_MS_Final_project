import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './Verify.css';
import './Authentication.css';
import Logo from './mailbox.png';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function Verify() {

    const[email,setEmail] = useState('');
    
    const navigate = useNavigate();
   function handleClick(){
    navigate('/')
   }
    
    useEffect(() => {

       


        const storedEmail = localStorage.getItem('userEmail');
    setEmail(storedEmail);

        // Override the body's background for this component
        document.body.style.background = "#fff";
    
        // Cleanup: Reset the background when the component is unmounted
        return () => {
          document.body.style.background =
            "linear-gradient(to bottom, #fff 150px, #f5f5f5 0px)";
        };
      }, []);

    return(
        <div >
            <div className='header '></div>

            <div className='verify-container'>
                <img className='maillogo' src={Logo} alt="logo"></img>
                <h2>Let's verify your email</h2>
                <p >We sent a verification link to:<br></br>
                <strong style={{ color: 'var(--ds-text, #172b4d)' }}>{email}</strong>
                </p>

                <div className='resend'>
                <button className='resend-btn'>Resend</button>
                </div>

                <a href="/" onClick={handleClick} className="dfemail">Sign up with different email</a>
                
            </div>
        </div>
    )
}

export default Verify;