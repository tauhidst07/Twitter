import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase.init'
import { Navigate } from 'react-router-dom';
import Loading from './Loading';

const ProtectedRoute = ({children}) => {
    const [user, loading, error] = useAuthState(auth);  
    if(loading){
        return <Loading/>
    }
    if(!user){
        return <Navigate to="/login" />
    } 
    else{
     return children;
    }
}

export default ProtectedRoute