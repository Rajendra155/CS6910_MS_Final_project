const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(cors())

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Hashtag@123",
    database:"user_authentication"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to database');
        return;
    }
 
   console.log('Connected to database');

  
   })

   //configure Nodemailer

const transporter = nodeMailer.createTransport({
    secure: true,
    host:'smtp.gmail.com',
    port: 465,
    auth :{
        user: 'chittirajendra777@gmail.com',
        pass: 'hhvtwidmnqpdpzgy'
    }
});


//sending thank you mail for new users
 function sendMail(to,sub,verificationToken){

    const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
   
    transporter.sendMail({
        to:to,
        subject:sub,
        html:`<p>Hi,</p>
        <p>Thank you for signing up..! We’re excited to have you join our community.</p>
        <p>To verify your email address, please click the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        `
    });
   
}

//otp generation and send via mail
async function sendOTPMail(to,sub,otp){
    try{
    transporter.sendMail({
        to:to,
        subject:sub,
        html:`
        <p>Your one time-password is:</p>
        <h3>${otp}</h3>
        `
    });
    return{
        success: true

}
}  catch(error){
    console.error('OTP email sending failed:', error);
    return {
        success: false,
        error: 'Failed to send OTP email'
    };
}
}

const JWT_SECRET_KEY ='yvIrjz3I2xfwaLMkQzvpy8IMCbLYFWge';
//Signup post request
   app.post("/signup",function(req,res){

    const{ email, password, confirmpassword, first_name,last_name, phone}= req.body;

    //server side validation

    //validate email format
    if(!/\S+@\S+\.\S+/.test(email)){
        return res.status(400).json({
          email:"Please enter a valid email address"
        });

    }


    if (!/^\+?[0-9\s\-]+$/.test(phone)) {
        return res.status(400).json({
            phone : 'Enter a valid phone number.'
        });
       
      }



      //check duplicate email

      const checkEmailQuery = 'select * from dummy_users where email = ?' ;

      con.query(checkEmailQuery,[email],function(err,result){
        if(err)
        {
            console.log('Error checking email');
            return res.status(500).json({
                email:"Internal server error"
            });
        }

      if(result.length > 0){
        return res.status(400).json({ email: "Email  already exists" });
      }
      

      //checking password strength

      if(password.length <= 6){
        return res.status(400).json({
            password:'Password must be greater than 6 characters'
        })
      }
      else if( !/[!@#$%^&*(),.?":{}|<>]/.test(password))
      {
        return res.status(400).json ({
            password: 'Password must contain one special character'
        })
      }


      //Hashing the password

      bcrypt.hash(password, saltRounds, function(err,hash){
        if(err)
        {
        console.log('Error in hashing password',err);
        }
        
        // If email is not taken insert user into the database

  const insertQuery = 'insert into dummy_users(first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)';
  con.query(insertQuery, [first_name, last_name, email, hash, phone], (err, result) => {
    if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ email: "Internal server error" });
    }
    

    console.log('Data saved succesfully');

    const verificationToken = jwt.sign({email: email}, JWT_SECRET_KEY, {expiresIn: '1h'});

   
    sendMail(email,'Email verification', verificationToken);
    res.status(201).json({ message: "User registered successfully" });
});

      })

      
   
    
      });

  

  })


  // Verify email with the token received in the link
app.get('/verify-email/:token', (req, res) => {
    const { token } = req.params;

   

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the JWT token
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const { email } = decoded;

        // Update the user status to verified in the database
        const updateQuery = 'UPDATE dummy_users SET is_verified = ? WHERE email = ?';
        con.query(updateQuery, [true, email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update user verification status' });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            res.status(200).json({ 
                message: 'Email verified successfully',
                success: true
            });
        });
    });
});

   

  //sign in post request

  app.post('/signin',function(req,res){

    const{email,password} = req.body;

    const checkEmail = 'select * from dummy_users where email= ?';
    con.query(checkEmail,[email],function(err,result){
        if(err)
        {
            return res.status(500).json({
                email:'Internal server error'
            })
        }

        if(result.length === 0)
        {
            return res.status(400).json({
                email:'Email not found'
            })
        }
    
        if(!result[0].is_verified)
        {
            return res.status(400).json({
                email:'Email not verified'
            })
        }

        if(!password)
        {
            return res.status(400).json({ password: "password required" });
        }

        //checking password validate 

        const storedpassword = result[0].password;
        bcrypt.compare(password,storedpassword, function(err, isMatch){
            if(err)
            {
                console.log('Error comparing passwords');
                return res.status(500).json({ password: "Internal server error" })
            }
            if (!isMatch) {
                return res.status(400).json({ password: "Incorrect password" });
            }

            // If the password matches, proceed with login
            res.status(200).json({ message: "Login successful" });
        })
        
        
    })
  })


  // Resend verification email

  app.post("/resend-verification", function(req,res){
    const {email} = req.body;
  
    const checkEmailQuery = `select * from dummy_users where email= ?`;
    con.query(checkEmailQuery,[email],function(err,result){
        if(err)
        {
            return res.status(500).json({
                message:'Internal server error'
            })
        }

        if(result.length === 0)
        {
            return res.status(400).json({
                message:'Email not found'
            })
        }

        if(result[0].is_verified)
        {
            return res.status(400).json({
                message:'Email is already verified'
            })
        }
        const verificationToken = jwt.sign({ email: email }, JWT_SECRET_KEY, { expiresIn: '1h' });

        sendMail(email,'Email verification', verificationToken);

        return res.status(200).json({
            message:'Email sent successfully'
        })

    })
  })
  //Otp generation and send via email

  const otpStore={};

  app.post('/otp', async function(req,res){
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();  
    const expiresAt = Date.now() + 5 * 60 * 1000;

     otpStore[email] = {otp, expiresAt}  
    const emailResult = await sendOTPMail(email,'One-Time-Passcode',otp);

    if(!emailResult.success)
    {
        return res.status(500).json({
            result: 'Failed to send Email'
        });
    }
    
    console.log('Otp sent successfully')
    return res.status(200).json({
        message:'An OTP has been sent successfully...'
    })

  })


  //verify otp request

  app.post('/verify-otp',function(req,res){
    const{ email,otp} = req.body;

    const storedOtp = otpStore[email];

    if(!storedOtp)
    {
        return res.status(404).json({
            message:'No OTP found for this email'
        });
    }

    if(Date.now() > storedOtp.expiresAt)
    {
        delete otpStore[email];
        return res.status(400).json({
            message:'OTP is expired'
        });
    }

    if(storedOtp.otp !== otp){
        return res.status(401).json({
            message:'Invalid OTP'
        })
    }

    delete otpStore[email];
    return res.status(200).json({
        message:'OTP validated successfully'
    })
  })

app.listen(3601, ()=>{
    console.log("server running on port 3601..")
})