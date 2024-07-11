import React, { useState } from 'react'
import twitterImg from "../../assets/twitter.jpeg" 
import TwitterIcon from '@mui/icons-material/Twitter'; 
import { useCreateUserWithEmailAndPassword,useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';  
import GoogleButton from 'react-google-button' 
import { Link,useNavigate } from 'react-router-dom'; 
import "./Login.css"
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; 
import { toast } from 'react-toastify';
const Signup = () => { 
    const [email , setEmail] = useState(""); 
    const [password, setPassword] = useState("");  
    const [username,setUsername] = useState("") 
    const [name, setName] = useState("")  
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);     
      
      const navigate = useNavigate()

      if(user){  
        navigate("/")
          if(user){
            console.log("user:",user)
          } 
          
      }
      if(error){
        console.log("error: ",error) 
      } 
      if(loading){
        console.log("loading...")
      }
    
      const handleSubmit = (e)=>{
        e.preventDefault() 
        console.log(email,password)
        createUserWithEmailAndPassword(email,password)  
        const  user = {
              username:username, 
              name:name,
              email:email,
        } 

       axios.post("https://twitter-backend-42z4.onrender.com/register",user)
       .then((res)=>{
          console.log("registration responsee: ",res) 
          if(res?.data?.message ==="user already registered"){
            toast.error(res.data.message);
          }
       }) 
       .catch((err)=>{
        console.log("registration error: ",err);
       })
       
    }    
    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth); 
    if(googleUser){ 
        navigate("/")
        console.log("google user: ",googleUser)
      }
    
    const handleGoogleSignIn = async ()=>{ 
        const res = await signInWithGoogle()  
        console.log("google sign in response",res?.user) 
        
        const  user = {
            username:res?.user?.email.split("@")[0], 
            name:res?.user?.displayName,
            email:res?.user?.email,
      } 

     axios.post("https://twitter-backend-42z4.onrender.com/register",user)
     .then((res)=>{
        console.log("registration response: ",res)
     }) 
     .catch((err)=>{
      console.log("registration error: ",err);
     })
     }
  return (
    <div className="login-container">

    <div className="image-container">
        <img className="image" src={twitterImg} alt="twitterImage" />
    </div>


    <div className="form-container">
        <div className="form-box">
            <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />

            <h2 className="heading">Happening now</h2>

            <div className="d-flex align-items-sm-center">
                <h3 className="heading1"> Join twitter today </h3>
            </div>


            {/* {error && <p className="errorMessage">{error}</p>} */}
            <form onSubmit={handleSubmit}>

                <input className="display-name" style={{ backgroudColor: "red" }}
                    type="username"
                    placeholder="@username "
                    onChange={(e) => setUsername(e.target.value)} 
                    value={username} 
                    required
                />

                <input className="display-name" style={{ backgroudColor: "red" }}
                    type="name"
                    placeholder="Enter Full Name"
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    required
                />

                <input className="email"
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)} 
                    email={email} 
                    required
                />



                <input className="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    required
                />


                <div className="btn-login">
                    <button type="submit" className="btn">Sign Up</button>
                </div>
            </form>
            <hr />
            <div className="google-button">
                <GoogleButton

                    className="g-btn"
                    type="light"
                    onClick={handleGoogleSignIn}
                />
            </div>
            <div>
                Already have an account?
                <Link
                    to="/login"
                    style={{
                        textDecoration: 'none',
                        color: '#5cc7f1',
                        fontWeight: '600',
                        marginLeft: '5px'
                    }}
                >
                    Log In
                </Link>
            </div>
        </div>
    </div>
</div>
  )
}

export default Signup
