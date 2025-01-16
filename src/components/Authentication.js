import React, { Component } from 'react';
import axios from 'axios';
import './Authentication.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


class Authentication extends Component{
    constructor(props){
        super(props);

        this.state ={
            email:'',
            password: '',
            confirmpassword:'',
            first_name:'',
            last_name:'',
            phone:'',
            showSignUp:false,
            loading:false,
            errors: {
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            phone:''
            }
        };
       
    }

    handleSignupClick(){
        this.setState (prevState => ({showSignUp: !prevState.showSignUp}));
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit(e){
        e.preventDefault();
        
        const{ email, password, confirmpassword, first_name,last_name, phone}= this.state;

        const updatedErrors = {
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            phone:''
        }

        if(!email){
            updatedErrors.email = "Please enter email address";
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            updatedErrors.email = 'Enter a valid email address.';
          }

        if(!password){
            updatedErrors.password = "password is required";
        }

        if(this.state.showSignUp){
            if (!first_name) {
                updatedErrors.first_name = 'First name is required.';
              }
              if (!last_name) {
                updatedErrors.last_name = 'Last name is required.';
              }
              if(!password){
                updatedErrors.password = "password is required";
            }
    
              if (!confirmpassword) {
                updatedErrors.confirmpassword = 'Confirm your password.';
              } 

              if(password !== confirmpassword)
              {
                updatedErrors.confirmPassword = 'Passwords do not match';
              }
              if(!phone)
              {
                updatedErrors.phone ="Phone number is required";
              }
              else if (!/^\+?[0-9\s\-]+$/.test(phone)) {
                updatedErrors.phone = 'Enter a valid phone number.';
              }


        }

        this.setState({errors: updatedErrors});

        this.setState({loading:true});


        if(this.state.showSignUp){

        axios.post('http://localhost:3601/signup',this.state)
        .then( response =>{
            console.log(response.data.message);
             toast.success(response.data.message, {
                position:"top-center",
               autoClose:1000,
               hideProgressBar:true,
              newestOnTop:false,
              closeOnClick:false,
              rtl:false,
              pauseOnFocusLoss: true,
              draggable: true,
            pauseOnHover: true, 
            theme:"colored"
              })

              localStorage.setItem('userEmail', this.state.email);
            setTimeout( ()=>{
                this.setState({ loading: false });
                this.props.navigate('/verify');
            },2000)
            this.setState({
                email:'',
                password: '',
                confirmpassword:'',
                first_name:'',
                last_name:'',
                phone:'',
                errors: {
                    email: '',
                password: '',
                confirmPassword: '',
                first_name: '',
                last_name: '',
                phone:''
                }
            })
        })
        .catch(error => {
            toast.error()
            this.setState({
                loading:false,
                errors :{
                    ...this.state.errors,
                    email: error.response?.data.email || '',
                    password: error.response?.data.password || '',
                    phone: error.response?.data.phone || '',
                }
            })
        })
    }
    else{

        //post sign API request

        axios.post('http://localhost:3601/signin',{ email,password})
        .then( response => {
            console.log(response.data.message);
            
            setTimeout( ()=>{
                this.setState({loading:false})
               this.props.navigate('/otp',{
                state: { email: email}
               });
            },1000)
            this.setState({
                email:'',
                password:'',

                errors:{
                    email: '',
                password: '',
                }
            })
            
        })
        .catch(error => {
            this.setState({
                loading:false,
                errors: {
                    ...this.state.errors,
                    email: error.response?.data.email || '',
                    password: error.response?.data.password || ''
                }
            })
        })

        
    }
    
}

handleResendVerification() {

    axios.post('http://localhost:3601/resend-verification',{email: this.state.email})
    .then( response =>{
        toast.success(response.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            newestOnTop: false,
            closeOnClick: false,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "colored"
          });
    })
    .catch( error =>{
        toast.error(error.response?.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            newestOnTop: false,
            closeOnClick: false,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "colored"
          });
    })
}




    handleSignupClick = this.handleSignupClick.bind(this);
    handleChange = this.handleChange.bind(this);
    handleSubmit = this.handleSubmit.bind(this);
    handleResendVerification = this.handleResendVerification.bind(this);

    render() {

        return(
          <div className="container">
{this.state.loading ? (<div class="spinner-container">

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

</div>): ( <div className='content-container'>
            <div className="form-header">
               {this.state.showSignUp? 'Sign up' : 'Sign in' }
            </div>

            <div className="form-header-well">
               <div className='rundown1'>{this.state.showSignUp? "Multiple Accounts are not allowed": "Don't have an Account?"}</div>
               <div className='rundown2'><a href="#" onClick={this.handleSignupClick}>{this.state.showSignUp?'If you have account use it to sign in':'Create an account'}</a></div>
            </div>

            <div className="note">* Indicates a required field</div>


            <div className='mainform'>
                <form onSubmit={this.handleSubmit}>
               
               { this.state.showSignUp && (
                <>
                <div className='form-group'>
                    <label className="required">First Name</label>
                    <input type="text" className={this.state.errors.first_name ? 'empty' : ''}  onChange={this.handleChange} placeholder="First name" value={this.state.first_name} name="first_name"></input>
                    {this.state.errors.first_name && <span className='error'>{this.state.errors.first_name}</span>}
                    </div>

                    <div className='form-group'>
                    <label className="required">Last Name</label>
                    <input type="text" className={this.state.errors.last_name ? 'empty' : ''}  onChange={this.handleChange} placeholder="Last name" value={this.state.last_name} name="last_name"></input>
                    {this.state.errors.last_name && <span className='error'>{this.state.errors.last_name}</span>}
                    </div> 
                    </>
               )
    }
                
                    <div className='form-group'>
                    <label className="required">Email *</label>
                    <input type="email" className={this.state.errors.email ? 'empty' : ''} onChange={this.handleChange} placeholder="Enter your email address" value={this.state.email} name="email"></input>
                    {this.state.errors.email && <span className="error">{this.state.errors.email}</span>}
                    </div>
                    
                    <div className='form-group'>
                     
                     <label className="required">Password *</label>
                     <input type="password" className={this.state.errors.password ? 'empty' : ''}  onChange={this.handleChange} placeholder="Enter password" value={this.state.password} name="password"></input>
                     {this.state.errors.password && <span className="error">{this.state.errors.password}</span>}
                    </div>
                    
                    {this.state.showSignUp && (
                        <>
                        <div className='form-group'>
                     <label className="required">Confirm Password</label>
                     <input type="password" className={this.state.errors.confirmPassword ? 'empty' : ''} onChange={this.handleChange} placeholder="Reenter password" value={this.state.confirmpassword} name="confirmpassword"></input>
                     {this.state.errors.confirmPassword && <span className='error'>{this.state.errors.confirmPassword}</span>}
                    </div>

                    <div className='form-group'>
                     
                     <label className="required">Phone</label>
                     <input type="text" className={this.state.errors.phone ? 'empty' : ''} onChange={this.handleChange} placeholder="Ex: +1(419-378-9192)" value={this.state.phone} name="phone"></input>
                     {this.state.errors.phone && <span className="error">{this.state.errors.phone}</span>}
                    </div>
                        </>
                    )}

                    <div class="form-actions">
                        <input type="submit" class="btn" value={this.state.showSignUp ?'Sign up':'Sign in'}></input>
                    </div>
                   
                   {this.state.showSignUp ? (
                    <>
                    
                    </>
                   ) : (
                    <>
                     <div class="form-footer">
                    <p><a>Forgot password</a></p>
                    <p><a href="#" onClick={this.handleResendVerification}>Resend verification email</a></p>
                    </div>
                    </>
                   )
                }
                   

                </form>
            </div>
           </div>)}

         
          
          </div>
        )
    }
}

export default Authentication;