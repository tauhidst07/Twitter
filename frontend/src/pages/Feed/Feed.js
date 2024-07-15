import React, { useEffect, useState } from 'react'
import './Feed.css'
import Tweetbox from './Tweetbox/Tweetbox'
import axios from 'axios';
import Post from './Post/Post'; 
import MenuIcon from '@mui/icons-material/Menu';  

const Feed = ({toggleSidebar,isVisible}) => { 
  const [posts,setPosts] = useState([]);  
  const [loading,setLoading] = useState(false);
   const fetchPosts = async ()=>{ 
    setLoading(true) 
    try{
      const res = await axios.get("https://twitter-backend-42z4.onrender.com/post") 
       setPosts(res?.data) 
       console.log("posts :",posts) 
       setLoading(false) 
    } 
    catch(err){ 
      setPosts([])
      console.log("somehing went wrong while fetching post",err);
    }
    setLoading(false)
   }
   useEffect(()=>{
    fetchPosts()
   },[])
  return (
    <div className='feed'>
      <div className="feed_header">  
      {
        !isVisible &&
          <MenuIcon className="hamburger_menu" onClick={toggleSidebar} />
      }

      <h2>Home</h2> 
      </div>
      <Tweetbox fetchPosts={fetchPosts}/> 
      { 
      loading ? (<div className='feed-loader'><div className='loader'></div></div>):(
        posts.map((p)=>(
          <Post p={p} key={p._id} />
        )
        ) 

      )
      }
    </div>
  )
}

export default Feed
