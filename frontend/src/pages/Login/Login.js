import React, { useState } from 'react'
import twitterImg from "../../assets/twitter.jpeg"
import TwitterIcon from '@mui/icons-material/Twitter';
import { useSignInWithEmailAndPassword ,useSignInWithGoogle} from 'react-firebase-hooks/auth';
import auth from '../../firebase.init'; 
import './Login.css' 
import GoogleButton from 'react-google-button' 
import { Link,useNavigate } from 'react-router-dom';  
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import axios from 'axios';
import { signOut } from 'firebase/auth';

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [otp, setOtp] = useState("");
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState({}); 
    // const [error, setError] = useState('')   
    const navigate = useNavigate();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth); 
    if (user) { 
        // navigate("/")
        // console.log('user:', user);
    }
    if (error) {
        console.log("error: ", error)
    }
    if (loading) {
        console.log("loading...")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();     

        if ( await signInWithEmailAndPassword(email, password)){ 
       signOut(auth)
        const deviceInfo = {
            browser: navigator.userAgent,
            os: navigator.platform,
            ip: await getIpAddress(),  
            deviceType:getDeviceType(),
          };
          setDeviceInfo(deviceInfo); 
          try { 
            
            const response = await axios.post('https://twitter-backend-42z4.onrender.com/login', {
              email,
              deviceInfo
            }); 
            console.log("login response ",response)  
            if(response.data.message==="Access denied"){
              toast.error(" Mobile logins are only allowed between 9 AM and 5 PM.") 
              return
            }
            if (response.data.requiresOtp) {
              setRequiresOtp(true);
            } else {
              console.log("Login successful"); 
              await signInWithEmailAndPassword(email, password)
              navigate("/");
            } 

          } catch (error) {
            // toast.error (error.response.data.message); 
            console.log("error: ",error)
          }
 
        }
       
    } 
    if(googleUser){
        navigate("/")
        // console.log("google user: ",googleUser)
      } 
      const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('https://twitter-backend-42z4.onrender.com/verify-otp', {
            email,
            otp,
            deviceInfo
          });
         console.log("otp res ",response)
          toast.success("OTP verified, login successful");  
            await signInWithEmailAndPassword(email, password)
          navigate("/");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
    
    const handleGoogleSignIn = async()=>{  
     signInWithGoogle();
       
    }  
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/mobile/i.test(ua)) return 'Mobile';
      if (/tablet/i.test(ua)) return 'Tablet';
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'iOS';
      if (/android/i.test(ua)) return 'Android';
      return 'Desktop';
    };
    const getIpAddress = async () => {
        try {
          const response = await axios.get('https://api.ipify.org?format=json');
          return response.data.ip;
        } catch (error) {
          console.error('Error fetching IP address:', error);
          return 'Unknown';
        }
      };
    return (
        <div className="login-container">
          <div className="image-container">
            <img className="image" src={twitterImg} alt="twitterImage" />
          </div>
          <div className="form-container">
            <div className="form-box">
              <TwitterIcon style={{ color: "skyblue" }} />
              <h2 className="heading">Happening now</h2>
              {error && <p style={{fontSize:"30px", fontWeight:600, color:"red"}}>Invalid username or Password</p>}
              {!requiresOtp ? (
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="btn-login">
                    <button type="submit" className="btn">Log In</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <input
                    type="text"
                    className="otp"
                    placeholder="Enter OTP" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="btn-login">
                    <button type="submit" className="btn">Verify OTP</button>
                  </div>
                </form>
              )}
              <hr />
              <div className="google-button">
                <GoogleButton
                  className="g-btn"
                  type="light"
                  onClick={handleGoogleSignIn}
                />
              </div>
            </div>
            <div>
              Don't have an account?
              <Link
                to="/signup"
                style={{
                  textDecoration: 'none',
                  color: '#5cc7f1',
                  fontWeight: '600',
                  marginLeft: '5px'
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      );
    };
    
    export default Login;