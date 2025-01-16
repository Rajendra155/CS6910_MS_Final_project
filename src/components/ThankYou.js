// ThankYouPage.jsx
import React from 'react';
import './ThankYou.css';
import Logo from './right.jpg';
import {Navigate} from 'react-router-dom';

class ThankYouPage extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            redirectToSignin: false
        };
    }
   
    handleContinue()
    {
        setTimeout( ()=>{
          this.setState({redirectToSignin: true})
        },1000)
    }

 handleContinue = this.handleContinue.bind(this);
    render() {

        if(this.state.redirectToSignin)
        {
            return <Navigate to="/"/>
        }
        return (
            <div className="thankyoucontainer">
                
                <img className="logo" src={Logo} alt="logo" /> 
                <div className='heading'>Email verified succesfully</div>
                <button className="thbtn" onClick={this.handleContinue}>Log in</button>
            </div>
        );
    }
}

export default ThankYouPage;
