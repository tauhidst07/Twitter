import React, { useState } from 'react'
import './Subscription.css'
import SubscriptionCard from './SubscriptionCard/SubscriptionCard'
import axios from 'axios';
import { useEffect } from 'react';
import useLoggedInUser from '../../hooks/useLoggedInUser';
const Subscription = () => {

  const [clickedButton, setClickedButton] = useState(2);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null); 
  const [loggedInUser] = useLoggedInUser(); 
  const handleButtonClicked = (index) => {
    setClickedButton(index);
  }
  const fetchSubscriptionInfo = async () => {
    const res = await axios.get("http://localhost:4000/subscription-options");
    setSubscriptionInfo(res.data);
    //  console.log("subs Info ",subscriptionInfo)
  }
  useEffect(() => {
    fetchSubscriptionInfo();
    console.log("logged in user ", loggedInUser)
  }, [loggedInUser])
  return ( 
      <div className='subscriptionPage'> 
      {
        loggedInUser.subscriptionType !== "free" ? (
          <div className="subscription">  
                 <h1>Already Subscribed</h1> 
                 <p>Your Subscription will end on {loggedInUser.subscriptionEndDate &&  loggedInUser?.subscriptionEndDate.split("T")[0]
                   }</p>
            </div>) :  (
      <div className="subscription">
        <h1>Upgrade to Premium</h1>
        <div className="buttons">
          <div className={`subs-btn ${clickedButton === 1 ? "clicked" : ""}`}
            onClick={() => setClickedButton(1)}
          >Annual</div>
          <div className={`subs-btn ${clickedButton === 2 ? "clicked" : ""}`}
            onClick={() => setClickedButton(2)}
          >Monthly</div>
        </div>
        <div className="cards">
          {subscriptionInfo &&
            <SubscriptionCard info={clickedButton == 2 ? subscriptionInfo?.monthly : subscriptionInfo?.yearly} type={clickedButton === 2 ? 'monthly' : 'yearly'} />
          }
        </div> 
     </div>    
        )
    }  

     </div>
     
  )
}

export default Subscription