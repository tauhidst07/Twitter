import React, { useState, useEffect } from 'react';
import './MainPage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import LockResetIcon from '@mui/icons-material/LockReset';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Post from '../../Feed/Post/Post';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../EditProfile/EditProfile';
import axios from "axios";
import useLoggedInUser from '../../../hooks/useLoggedInUser';
const MainPage = ({ user }) => {
    const navigate = useNavigate();
    const username = user?.email?.split("@")[0];
    const [loggedInUser] = useLoggedInUser(); 
    const [posts,setPosts] = useState([]);  
    const [isLoading,setIsLoading] = useState(false)
    const fetchPosts = async ()=>{
     const res = await axios.get(`https://twitter-backend-42z4.onrender.com/userPost?email=${user?.email}`) 
      setPosts(res?.data)
    }
    useEffect(()=>{
     fetchPosts()
    },[posts])
    const handleUploadCoverImage = (e) => {
        const image = e.target.files[0]; 
        const formData = new FormData();  
        setIsLoading(true);
        formData.set("image",image); 
        axios.post("https://api.imgbb.com/1/upload?key=3a388253f2f54b16be537f674f0bd819",formData)
        .then( async (res)=>{
         console.log("response",res) 
         const url = res.data.data.display_url; 
         const userCoverImage = {
            email: user?.email,
            coverImage: url,
        }
          if (url) {
           axios.patch(`https://twitter-backend-42z4.onrender.com/userUpdates/${user?.email}`,userCoverImage)
           .then((res)=>{ 
            setIsLoading(false) 
            console.log("cover upload res ",res); 
           })
           .catch((er)=>{
            console.log("error while uploading cover: ",er);  
            setIsLoading(false) 
           })
          }
        })
        .catch((err)=>{
         console.log("image upload err: ",err) 
         setIsLoading(false)
        })
    }
    const handleUploadProfileImage = (e) => {
        const image = e.target.files[0]; 
        const formData = new FormData();  
        setIsLoading(true);
        formData.set("image",image); 
        axios.post("https://api.imgbb.com/1/upload?key=3a388253f2f54b16be537f674f0bd819",formData)
        .then( (res)=>{
         console.log("response",res) 
         const url = res.data.data.display_url; 
         const userProfileImage = {
            email: user?.email,
            profileImage: url,
        }
       
        setIsLoading(false) 
          if (url) {
           axios.patch(`https://twitter-backend-42z4.onrender.com/userUpdates/${user?.email}`,userProfileImage)
           .then((res)=>{
            console.log(res); 
           })
           .catch((er)=>{
            console.log("error while uploading cover: ",er); 
           })
          }
        })
        .catch((err)=>{
         console.log("image upload err: ",err) 
         setIsLoading(false)
        })
    }
    return (
        <div>
        <ArrowBackIcon className='arrow-icon' onClick={() => navigate('/')} />
        <h4 className='heading-4'>{username}</h4>
        <div className='mainprofile' >
          {/* <h1 className='heading-1' style={{ color: "white" }}>Building of profile page Tweets </h1> */}
          <div className='profile-bio'>
            {
              <div >
                <div className='coverImageContainer'>
                  <img src={
                    !isLoading &&
                   loggedInUser?.coverImage ? loggedInUser?.coverImage : 'https://www.proactivechannel.com/Files/BrandImages/Default.jpg'} alt="" className='coverImage' loading='lazy'/>
                  <div className='hoverCoverImage'>
                    <div className="imageIcon_tweetButton">
                      <label htmlFor='image' className="imageIcon">
                        {
                          isLoading ?
                            <LockResetIcon className='photoIcon photoIconDisabled ' />
                            :
                            <CenterFocusWeakIcon className='photoIcon' />
                        }
                      </label>
                      <input
                        type="file"
                        id='image'
                        className="imageInput"
                        onChange={handleUploadCoverImage}
                      />
                    </div>
                  </div>
                </div>
                <div className='avatar-img'>
                  <div className='avatarContainer'>
                    <img src={loggedInUser?.profileImage ? loggedInUser?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} className="avatar" alt='' />
                    <div className='hoverAvatarImage'>
                      <div className="imageIcon_tweetButton">
                        <label htmlFor='profileImage' className="imageIcon">
                          {
                            isLoading ?
                              <LockResetIcon className='photoIcon photoIconDisabled ' />
                              :
                              <CenterFocusWeakIcon className='photoIcon' />
                          }
                        </label>
                        <input
                          type="file"
                          id='profileImage'
                          className="imageInput"
                          onChange={handleUploadProfileImage}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='userInfo'>
                    <div>
                      <h3 className='heading-3'>
                        {loggedInUser?.name ? loggedInUser.name : user && user.displayName}
                      </h3>
                      <p className='usernameSection'>@{username}</p>
                    </div>
                    <EditProfile user={user} loggedInUser={loggedInUser} />
                  </div>
                  <div className='infoContainer'>
                    {loggedInUser?.bio ? <p>{loggedInUser.bio}</p> : ''}
                    <div className='locationAndLink'>
                      {loggedInUser?.location ? <p className='subInfo'><MyLocationIcon /> {loggedInUser.location}</p> : ''}
                      {loggedInUser?.website ? <p className='subInfo link'><AddLinkIcon /> {loggedInUser.website}</p> : ''}
                    </div>
                  </div>
                  <h4 className='tweetsText'>Tweets</h4>
                  <hr />
                </div>
                {
                  posts.map(p => <Post p={p} key={p._id}
                  />)
                }
              </div>
            }
          </div>
        </div>
      </div>
    )
}

export default MainPage