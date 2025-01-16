import React, {Component} from 'react';
import './OTPauthentication.css';
import Logo from './auth.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

function WithRouter(Component) {
  function ComponentWithRouterProp(props) {
      const location = useLocation();
      const navigate = useNavigate();
      return <Component {...props} location={location} navigate={navigate} />;
  }
  return ComponentWithRouterProp;
}

class OTPauthentication extends Component{
    constructor(props){
        super(props)
        const storedemail = props.location?.state?.email;
           this.state ={
            email:storedemail,
            otp:{},
            errors: {
              email:'',
              result:''
            },
            message:'',
            otpSent: false,
            redirectToBoard: false
           
        }
    }



  componentDidMount() {
        const { email, otpSent } = this.state;

        if (email && !otpSent) {
            // Use setState callback to ensure state is updated before API call
            this.setState({ otpSent: true }, () => {
                axios.post('http://localhost:3601/otp', { email })
                    .then(response => {
                        toast.success(response.data.message, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: true,
                            newestOnTop: false,
                            closeOnClick: false,
                            rtl: false,
                            pauseOnFocusLoss: true,
                            draggable: true,
                            pauseOnHover: true,
                            theme: "colored"
                        });
                        this.setState({
                            errors: {
                                email: '',
                                result: ''
                            },
                            message: response.data.message
                        });
                    })
                    .catch(error => {
                        this.setState({ otpSent: false }); // Reset flag on error
                        toast.error(error.response?.data.result || 'Failed to send OTP', {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            newestOnTop: false,
                            closeOnClick: false,
                            rtl: false,
                            pauseOnFocusLoss: true,
                            draggable: true,
                            pauseOnHover: true,
                            theme: "colored"
                        });
                        this.setState({
                            errors: {
                                ...this.state.errors,
                                result: error.response?.data.result || ''
                            },
                            message: ''
                        });
                    });
            });
        } 
    }

  
    handleChange(e)
    {
        this.setState({[e.target.name]:e.target.value})
    }

    handleOtpChange(e)
    {
      const name = e.target.name;
      const value = e.target.value;

      if(value.length <= 1)
      {
        this.setState({
          otp:{
          ...this.state.otp,
          [name]: value
          }
        })
      }
      const nextInput = document.querySelector(`input[name='${parseInt(name)+1}']`);//selecting next box
    if (nextInput) nextInput.focus();
    }

    handleSubmit(e)
      {
        e.preventDefault();

        const {email,otp} = this.state

        const otpArray = Object.values(otp);

        

        if(otpArray.length !== 6)
        {
          toast.error('Please enter a 6 digit OTP');
          return;
        }


        //send a post request to backend for the verification of OTP

        axios.post('http://localhost:3601/verify-otp',{email, otp: otpArray.join('')})
        .then(response => {
          toast.success(response.data.message, {
            position:"top-center",
           autoClose:1250,
           hideProgressBar:true,
          newestOnTop:false,
          closeOnClick:false,
          rtl:false,
          pauseOnFocusLoss: true,
          draggable: true,
        pauseOnHover: true, 
        theme:"colored"
          });
          setTimeout(() => {
            this.setState({ redirectToBoard: true }); 
        }, 2000);
          this.setState({
            email:'',
            otp:{},
          
           })
  

        })
        .catch(error =>{
          toast.error(error.response?.data.message);
        })

      }


    


    handleChange = this.handleChange.bind(this);
    handleOtpChange = this.handleOtpChange.bind(this);
    handleSubmit = this.handleSubmit.bind(this);

  
  
    
    render()
    {
      if (this.state.redirectToBoard) {
        return <Navigate to="/board" />;  // Trigger navigation to the '/board' route
    }

        return(
            <div className='outer-container'>
              <div className='form-header'>Two Factor<br/> Authentication</div>

              <div className="imageplace">
              <img className='authimg' src={Logo} alt="authentication logo" ></img>
              </div>

              <div className="txt">
              We've sent a One-Time Password (OTP) to your registered email address: <strong>{this.state.email}</strong>.
              </div>


             
  
<div className='note'>
<span>*Please enter 6-digit OTP</span>
</div>
  
        <div className='otp-input-fields'>
       
                {[0,1,2,3,4,5].map( (index) => (
                  <input type="number" key={index} name={index.toString()} maxLength={1} pattern="\d{1}" className='otp_num'
                   value={this.state.otp[index] || ''}  onChange={this.handleOtpChange}/>
                ))}
              </div>


              
              <div className="verify-btn">
                <input type="submit" onClick={this.handleSubmit} value="Verify"  />
              </div>

            </div>
        )
    }
}

export default WithRouter(OTPauthentication);
