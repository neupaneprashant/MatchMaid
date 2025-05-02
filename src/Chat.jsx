import React from "react";
import "./Chat.css";  // Important!

function Chat({ name, message, timestamp, profilePic }) {
  return (
    <div className="chat">
      <img src={profilePic} alt="profile" className="chat__image" />
      <div className="chat__details">
        <h2 className="chat__name">{name}</h2>
        <p className="chat__message">{message}</p>
      </div>
      <p className="chat__timestamp">{timestamp}</p>
    </div>
  );
}

export default Chat;