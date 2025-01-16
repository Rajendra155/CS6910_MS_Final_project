import React from 'react';
import Authentication from './Authentication';
import OTPauthentication from './OTPauthentication';
import {useNavigate} from 'react-router-dom';

function AuthenticationWrapper() {
    const navigate = useNavigate();
    return(
        <>
        <Authentication navigate={navigate} />
        
        </>
    )
}

export default AuthenticationWrapper;