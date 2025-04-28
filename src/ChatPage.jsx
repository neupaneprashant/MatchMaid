import React from "react";
import { useNavigate } from "react-router-dom";
import "./chatPage.css";
import Chat from "./Chat";

function ChatPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");  // Make sure your back button goes home!
  };

  return (
    <div className="chatPage">
      <div className="chatPage__header">
        <button className="backButton" onClick={handleBack}>
          ←
        </button>
        <h1 className="chatPage__title">Chats</h1>
      </div>

      <div className="chatPage__chats">
      <Chat
  name="Sarah"
  message="Hey! how are you 😀"
  timestamp="35 minutes ago"
  profilePic="https://i.pravatar.cc/100"
/>
<Chat
  name="Ellen"
  message="What's up ❤️"
  timestamp="55 minutes ago"
  profilePic="https://i.pravatar.cc/100"
/>
<Chat
  name="Sandra"
  message="Ola!"
  timestamp="3 days ago"
  profilePic="https://i.pravatar.cc/100"
/>

      </div>
    </div>
  );
}

export default ChatPage;
