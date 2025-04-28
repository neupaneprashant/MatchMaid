import React, { useState } from "react";
import Chat from "./Chat";
import "./ChatPage.css";


function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState(""); // New input text

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ana Malbasa",
      message: "See you later!",
      timestamp: "5 min ago",
      profilePic: "https://i.pravatar.cc/150?img=32",
      conversation: ["Hi Ana!", "See you later!", "Bye!"]
    },
    {
      id: 2,
      name: "Paul Osmond",
      message: "Meeting at 5?",
      timestamp: "10 min ago",
      profilePic: "https://i.pravatar.cc/150?img=47",
      conversation: ["Are we still meeting?", "Yes, at 5 PM."]
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;

    // Update the user's conversation
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            conversation: [...user.conversation, messageInput]
          };
        }
        return user;
      })
    );

    // Also update the selectedUser immediately
    setSelectedUser(prevUser => ({
      ...prevUser,
      conversation: [...prevUser.conversation, messageInput]
    }));

    // Clear input
    setMessageInput("");
  };

  return (
    <div className="chatPage">
  
  {/* Sidebar */}
  <div className="chatPage__sidebar">
    <h2>Chats</h2>
    {users.map((user) => (
      <div key={user.id} onClick={() => setSelectedUser(user)}>
        <Chat
          name={user.name}
          message={user.message}
          timestamp={user.timestamp}
          profilePic={user.profilePic}
        />
      </div>
    ))}
  </div>

  {/* Chat Window */}
  <div className="chatPage__chatWindow">
    {selectedUser ? (
      <>
        <div className="chatPage__messages">
          <h2>Chat with {selectedUser.name}</h2>
          {selectedUser.conversation.map((msg, index) => (
            <p key={index} className="chatPage__message">
              {msg}
            </p>
          ))}
        </div>

        {/* Input Area */}
        <div className="chatPage__inputContainer">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="chatPage__input"
          />
          <button
            onClick={handleSendMessage}
            className="chatPage__sendButton"
          >
            Send
          </button>
        </div>
      </>
    ) : (
      <h2>Select a chat to start messaging</h2>
    )}
  </div>

</div>

  );
}

export default ChatPage;
