import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase.init';

const useLoggedInUser = () => { 

    const [user] = useAuthState(auth);  
    const email = user?.email;   
    const [loggedInUser,setLoggedInUser] = useState({});
    
    useEffect(()=>{ 
        if (email ){
        fetch(`http://localhost:4000/loggedInUser?email=${email}`)
        .then((res)=>res.json()) 
        .then((data)=>{ 
            setLoggedInUser(data)
        }) 
        .catch((error)=>{
            console.log("something went wrong while fetching user",error)
        }) 
    }
    },[email,loggedInUser])
 
    return [loggedInUser,setLoggedInUser];
}

export default useLoggedInUser