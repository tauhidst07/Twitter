import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreIcon from "@mui/icons-material/More";
import Divider from '@mui/material/Divider';
import DoneIcon from '@mui/icons-material/Done';
import ListItemIcon from '@mui/material/ListItemIcon'; 
import TranslateIcon from '@mui/icons-material/Translate';
import SidebarOptions from './SidebarOptions';
import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import useLoggedInUser from '../../hooks/useLoggedInUser'; 
import CloseIcon from '@mui/icons-material/Close';
const Sidebar = ({ handleLogout, user,isVisible,toggleSidebar}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)
    const [loggedInUser] = useLoggedInUser();
    const userProfileImage = loggedInUser.profileImage ? (loggedInUser.profileImage) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
    const customUsername = user?.email.split("@")[0]; 
    useEffect(()=>{
        console.log("in sidebar ",loggedInUser); 

    },[])
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
             <CloseIcon className="hamburger_menu" onClick={toggleSidebar} />
            <TwitterIcon className='sidebar_twitterIcon' />
            <NavLink to="/home/feed" className="nav-link">
                <SidebarOptions active Icon={HomeIcon} text={"Home"} />
            </NavLink>
            <NavLink to="/home/explore" className="nav-link">
                <SidebarOptions active Icon={SearchIcon} text={"Explore"} />
            </NavLink>
            <NavLink to="/home/notifications" className="nav-link">
                <SidebarOptions active Icon={NotificationsNoneIcon} text={"Notification"} />
            </NavLink>
            <NavLink to="/home/messages" className="nav-link">
                <SidebarOptions active Icon={MailOutlineIcon} text={"Messages"} />
            </NavLink>
            <NavLink to="/home/bookmarks" className="nav-link">
                <SidebarOptions active Icon={BookmarkBorderIcon} text={"Bookmarks"} />
            </NavLink>
            <NavLink to="/home/lists" className="nav-link">
                <SidebarOptions active Icon={ListAltIcon} text={"Lists"} />
            </NavLink>
            <NavLink to="/home/profile" className="nav-link">
                <SidebarOptions active Icon={PermIdentityIcon} text={"Profile"} />
            </NavLink>
            <NavLink to="/home/more" className="nav-link">
                <SidebarOptions active Icon={MoreIcon} text={"More"} />
            </NavLink> 
            <NavLink to="/home/subscription" className="nav-link">
                <SidebarOptions active Icon={TwitterIcon} text={"Premium"} />
            </NavLink> 
            <NavLink to="/home/languages" className="nav-link">
                <SidebarOptions active Icon={TranslateIcon} text={"Languages"} />
            </NavLink>

            <Button variant='outlined' className='sidebar_tweet'>
                Tweet
            </Button>
            <div className="profile_info">
                <Avatar src={userProfileImage}>
                </Avatar>
                <div className="user_info">
                    <h4>{
                        loggedInUser?.name ? (loggedInUser?.name) : (user && user.displayName)
                    }</h4>
                    <h5>
                        {
                            loggedInUser?.username ? (loggedInUser?.username) : (customUsername)
                        }
                    </h5>
                </div>
                <IconButton
                    size='small'
                    sx={{ ml: 2 }}
                    aria-controls={openMenu ? "basic-manu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}
                >
                    <MoreHorizIcon />
                </IconButton>
                <Menu id='basic-menu' anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
                    <MenuItem className='profile_info1' >
                        <Avatar src={loggedInUser?.profileImage ? loggedInUser?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"}>
                        </Avatar>
                        <div className="user_info subUser_info">
                            <div>
                                <h4>{
                                    loggedInUser?.name ? (loggedInUser?.name) : (user && user.displayName)
                                }</h4>
                                <h5>
                                    {
                                        loggedInUser?.username ? (loggedInUser?.username) : (customUsername)
                                    }
                                </h5>
                            </div>
                            <ListItemIcon className='done_icon'><DoneIcon /></ListItemIcon>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
                    <MenuItem onClick={handleLogout}> Log out @{loggedInUser?.username ? (loggedInUser?.username) : (customUsername)} </MenuItem>
                </Menu>

            </div>

        </div>
    )
}

export default Sidebar