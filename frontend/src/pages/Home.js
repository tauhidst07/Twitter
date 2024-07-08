import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Widgets from './Widgets/Widgets'
import Feed from './Feed/Feed'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase.init'
import { signOut } from 'firebase/auth'
import { Outlet } from 'react-router-dom'
import useLoggedInUser from '../hooks/useLoggedInUser'

const Home = ({isVisible,toggleSidebar}) => { 
  const [user] = useAuthState(auth);   
  const [loggedInUser] = useLoggedInUser(); 
  // console.log("logged in user : ",loggedInUser)
  const handleLogout = ()=>{
    signOut(auth)
  }
  return (
    <div className='app'>
       <Sidebar handleLogout={handleLogout} user={user} isVisible={isVisible} toggleSidebar={toggleSidebar} />  
       <Outlet/>
       <Widgets /> 
       
    </div>
  )
}

export default Home