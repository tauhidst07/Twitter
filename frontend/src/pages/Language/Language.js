import React, { useEffect, useState } from 'react'
import "./Language.css"
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import useLoggedInUser from '../../hooks/useLoggedInUser'; 
import { updateTheme } from '../../utility/updateTheme';
const Language = ({userLanguage}) => {  
    const defaultLanguage = userLanguage? userLanguage :'en';
    const [loggedInUser] = useLoggedInUser(); 
   const [otp,setOtp] = useState('')   
   const [otpVerified,setOtpVerified]=useState(false) 

   const [language, setLanguage] = useState(defaultLanguage);
   const [isOtpSent, setIsOtpSent] = useState(false); 
   const email = loggedInUser?.email;   
   


 


   
  const handleSendOtp = async () => {
    try {
      await axios.post('https://twitter-backend-42z4.onrender.com/language/send-otp', { email });
      setIsOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };
  const handleVerifyOtp = async () => {
    try {
      await axios.post('https://twitter-backend-42z4.onrender.com/language/verify-otp', { email, otp, language });
      updateTheme(language);
      toast.success('Theme changed successfully based on language'); 
      setIsOtpSent(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    }
  };
  return (
    <div className='language'>
      <h2>Change Theme Based on Language</h2>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="hi">Hindi</option>
        <option value="pt">Portuguese</option>
        <option value="ta">Tamil</option>
        <option value="bn">Bengali</option>
        <option value="fr">French</option>
      </select>
      {!isOtpSent ? (
        <button onClick={handleSendOtp}>Send OTP</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  )
}

export default Language