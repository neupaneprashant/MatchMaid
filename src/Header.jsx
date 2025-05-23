import React from 'react';
import "./Header.css";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import FormIcon from "@material-ui/icons/Forum";


const Header = () => {
    return (
        <div className='header'>
            <PersonIcon></PersonIcon>
            <IconButton>
            <PersonIcon  fontSize="large" className="header_icon"/>
            </IconButton>
            <img
            className="header_logo"
            src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt=""
            />
             <IconButton>
            <FormIcon  fontSize="large" className="header_icon"/>
            </IconButton>
        </div>
    )
}

export default Header