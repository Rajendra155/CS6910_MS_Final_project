import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Authentication.css';
import { useNavigate, useParams } from 'react-router-dom';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect( () =>{

        axios.get(`http://localhost:3601/verify-email/${token}`)
        .then( response =>{
            setMessage(response.data.message);
           
            setTimeout( ()=>{
                setLoading(false);
                navigate('/thankyou')
            },2000)
        })
        .catch( error =>{
            setMessage(error.response?.data.message);
            setLoading(false);
        })

        
    },[token, navigate])
    

    // Return a loading state or error message while processing
    return (
        <div className="flex items-center justify-center min-h-screen">
            {loading ? (
                <div class="spinner-container">

                <div class="dots">
                <span style={{ '--i': 1 }}></span>
                <span style={{ '--i': 2 }}></span>
                <span style={{ '--i': 3 }}></span>
                <span style={{ '--i': 4 }}></span>
                <span style={{ '--i': 5 }}></span>
                <span style={{ '--i': 6 }}></span>
                <span style={{ '--i': 7 }}></span>
                <span style={{ '--i': 8 }}></span>
                <span style={{ '--i': 9 }}></span>
                <span style={{ '--i': 10 }}></span>
                <span style={{ '--i': 11 }}></span>
                <span style={{ '--i': 12 }}></span>
                <span style={{ '--i': 13 }}></span>
                <span style={{ '--i': 14 }}></span>
                <span style={{ '--i': 15 }}></span>
                
                </div>
                
                </div>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}

export default VerifyEmail;




