import React, { useState } from 'react' 
import './SubscriptionCard.css' 
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const SubscriptionCard = ({info,type}) => {  
  const [user] = useAuthState(auth);    
  const email = user?.email;
  const handlePayment = async (plan) => {
    try {
      const orderRes = await axios.post('http://localhost:4000/create-order', {
        amount: plan.price,
        currency: 'INR',
      });

      const { id: order_id } = orderRes.data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: plan.price * 100,
        currency: 'INR',
        name: 'Twitter Clone',
        description: 'Subscription Plan',
        order_id,
        handler: async (response) => {
          const paymentRes = await axios.post('http://localhost:4000/verify-payment', {
            email,
            order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            plan,
            duration: plan.duration,
          });
          toast(paymentRes.data.message);
        },
        prefill: {
          email,
        },
        notes: {
          subscription_type: plan.type,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };
  const basicHandler = ()=>{ 

     const plan = {
      type:'basic', 
      duration:type, 
      postLimit:info.basic.postLimit, 
      price: info.basic.price
     }  
     handlePayment(plan);
  } 
  const premiumHandler = ()=>{
    const plan = {
      type:'premium', 
      duration:type, 
      postLimit:info.premium.postLimit, 
      price: info.premium.price
     }    
     handlePayment(plan);
  }
  return ( 
    <>
    <div className='card'> 
         <h3>Basic</h3>
         <p>{info.basic.price}₹</p> 
         <p>Make {info.basic.postLimit} post daily</p> 
         <button className='subscribe' onClick={basicHandler}>Subscribe</button>
    </div>  
    <div className='card'> 
         <h3>Premium</h3>
         <p>{info.premium.price}₹</p> 
         <p>Make {info.premium.postLimit} post daily</p> 
         <button className='subscribe' onClick={premiumHandler}>Subscribe</button>
    </div> 

    </>
  )
}

export default SubscriptionCard