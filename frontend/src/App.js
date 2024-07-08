import React, { useEffect, useState } from 'react'
import {Routes,Route} from 'react-router-dom' 
import Home from './pages/Home' 
import Login from './pages/Login/Login' 
import "./App.css"
import Signup from './pages/Login/Signup' 
import ProtectedRoute from './pages/ProtectedRoute'
import Loading from './pages/Loading'
import Feed from './pages/Feed/Feed'
import Explore from './pages/Explore/Explore'
import Notifications from './pages/Notifications/Notifications'
import Messages from './pages/Messages/Messages'
import Bookmarks from './pages/Bookmarks/Bookmarks'
import Lists from './pages/Lists/Lists'
import Profile from './pages/Profile/Profile'
import More from './pages/More/More'
import Subscription from './pages/Subscription/Subscription'
import Language from './pages/Language/Language' 
import useLoggedInUser from './hooks/useLoggedInUser'
import { updateTheme } from './utility/updateTheme'



const App = () => { 
  const [loggedInUser] = useLoggedInUser();  
  const userLanguage = loggedInUser?.language;   
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev)=>!prev); 
    console.log("clicked")
  };
    useEffect(()=>{
   if(userLanguage){
    updateTheme(userLanguage);
  }
},[loggedInUser])
  return ( 
    
    <div  className="container"> 
     <Routes>
      <Route path="/"  element={<ProtectedRoute><Home isVisible={isSidebarVisible} toggleSidebar={toggleSidebar}/></ProtectedRoute>}>
        <Route index element={<Feed toggleSidebar={toggleSidebar} isVisible={isSidebarVisible}/>} />
      </Route> 
      <Route path='/home' element={<ProtectedRoute><Home isVisible={isSidebarVisible} toggleSidebar={toggleSidebar}/></ProtectedRoute>}>
         <Route path='feed' element={<Feed toggleSidebar={toggleSidebar} isVisible={isSidebarVisible}/>} />  
         <Route path='explore' element={<Explore/>} />  
         <Route path='notifications' element={<Notifications/>} />  
         <Route path='messages' element={<Messages/>} />  
         <Route path='bookmarks' element={<Bookmarks/>} />  
         <Route path='lists' element={<Lists/>} />  
         <Route path='profile' element={<Profile/>} />  
         <Route path='more' element={<More/>} />  
         <Route path='subscription' element={<Subscription/>} /> 
         <Route path='languages' element={<Language userLanguage={userLanguage}/>} />
      </Route>
      <Route path="/login"  element={<Login/>} /> 
      <Route path="/signup"  element={<Signup/>} />  
      <Route path="/page-loading"  element={<Loading/>} /> 

     </Routes> 
    </div> 

  
  )
}

export default App