import { Avatar, Button } from '@mui/material';
import React, { useState } from 'react' 
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; 
import "./Tweetbox.css" 
import axios from 'axios'  
import Loading from '../../Loading';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import 'react-toastify/dist/ReactToastify.css'; 
import { toast } from 'react-toastify';
 
const Tweetbox = () => {
    const [post, setPost] = useState("");
    const [imageURL, setImageURL] = useState("");  
    const [isLoading,setIsLoading] = useState(false)  
    const [loggedInUser] = useLoggedInUser();  
    const [user] = useAuthState(auth) 
    const [name,setName] = useState(""); 
    const [username, setUsername]= useState("");

    const userProfileImage = loggedInUser.profileImage ? (loggedInUser.profileImage) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

    const imageHandler = (e)=>{ 
       const image = e.target.files[0]; 
       const formData = new FormData();  
       setIsLoading(true);
       formData.set("image",image); 
       axios.post("https://api.imgbb.com/1/upload?key=3a388253f2f54b16be537f674f0bd819",formData)
       .then((res)=>{
        console.log("response",res) 
        setImageURL(res.data.data.display_url);  
        setIsLoading(false)
       })
       .catch((err)=>{
        console.log("image upload err: ",err) 
        setIsLoading(false)
       })
    }
    const handleTweet = (e) => {   
        e.preventDefault();    
        console.log("tweeting..."); 
        console.log("log user in tweet",loggedInUser) 
        console.log("user: ",user?.providerData[0].providerId)
        if(user?.providerData[0].providerId == "password"){ 
            console.log("name: ",loggedInUser?.name);
            setName(loggedInUser?.name); 
            setUsername(loggedInUser?.username);
        } 
        else{
            setName(user.displayName); 
            setUsername(user.email.split("@")[0]);
        }
        if(!isLoading && name){ 
        const userPost = { 
            profilePhoto:userProfileImage, 
            post:post, 
            photo:imageURL, 
            name:name, 
            username:username, 
            email:user.email
        }  
        fetch('https://twitter-backend-42z4.onrender.com/post',{
            method:"POST", 
            headers:{
                'content-type':'application/json'
            }, 
            body:JSON.stringify(userPost)
        })
        .then((res)=>res.json())
        .then((data)=>{ 
            console.log("post response: ",data);  
            if (data?.acknowledged){
                toast.success("posted sucessfully")
            }
            if(data?.message === "Post limit reached for today"){ 
                const message = data.message+" subscribe to post more."
                toast.error(message)
            }
        }) 
        .catch((err)=>{
            console.log("error while fetching ",err)  
            console.log(err.message)
        }) 

        setPost(""); 
        setImageURL("");
    }
}
        
   
    return (
        <div className='tweetBox'>
            <form onSubmit={handleTweet}>
                <div className='tweetBox__input'>
                    <Avatar src={loggedInUser?.profileImage ? loggedInUser?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                    <input type="text"
                        placeholder="what's happening" 
                        value={post}
                        onChange={(e) => setPost(e.target.value)} 
                        required
                    />
                </div> 
                <div className="imageIcon_tweetButton">
                    <label htmlFor="image" className='imageIcon'>
                           {
                            isLoading ? <p>...</p> :<p>{ imageURL? <img src={imageURL} alt="" style={{width:"50px"}} /> :<AddPhotoAlternateIcon/> }</p>
                           }
                    </label> 
                    <input type="file"  id='image' className='imageInput' onChange={imageHandler}/> 
                    <Button className='tweetBox__tweetButton' type="submit">
                      Tweet
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Tweetbox