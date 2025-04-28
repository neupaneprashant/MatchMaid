import React, { useState, useRef, useEffect } from 'react';

// Sample user data with avatars and initial messages
const initialUsers = [
  {
    id: 1,
    name: "Ana Malbasa",
    avatar: "https://i.pravatar.cc/150?img=32",  // sample avatar image
    messages: [
      { text: "Hey, how are you?", self: false }, 
      { text: "I'm doing well, thank you!", self: true }
    ]
  },
  {
    id: 2,
    name: "Paul Osmond",
    avatar: "https://i.pravatar.cc/150?img=47",
    messages: [
      { text: "See you at 5!", self: false }
      // You can add more sample messages here if needed
    ]
  },
  {
    id: 3,
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=12",
    messages: [
      // No messages yet for this user
    ]
  }
];

function ChatPage() {
  const [users, setUsers] = useState(initialUsers);
  const [activeUserId, setActiveUserId] = useState(initialUsers[0].id);
  const [messageInput, setMessageInput] = useState("");
  const inputRef = useRef(null);

  // Focus the input field after sending a message
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeUserId]);  // also focus when switching chats

  // Find the currently active user's data
  const activeUser = users.find(u => u.id === activeUserId);

  const handleSelectUser = (userId) => {
    if (userId === activeUserId) return;  // already selected
    setActiveUserId(userId);
    setMessageInput("");              // clear input when switching chat
    // input will be focused by useEffect on activeUserId change
  };

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (text === "") return;
    // Append the new message to the active user's message list
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === activeUserId) {
        return {
          ...user,
          messages: [...user.messages, { text, self: true }]
        };
      }
      return user;
    }));
    setMessageInput("");  // clear the input field
    // Auto-focus the input for convenience (refocus after sending)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/** Sidebar: User list **/}
      <div className="flex flex-col bg-gray-100 border-r w-64 flex-shrink-0">
        {// (Optional) Search bar at top of sidebar 
        <div className="p-4">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>
        }
        {/* User list items */}
        {users.map(user => (
          <div 
            key={user.id} 
            onClick={() => handleSelectUser(user.id)}
            className={
              "flex items-center p-3 cursor-pointer border-l-4 " + 
              (user.id === activeUserId 
                ? "bg-blue-50 border-blue-500"              // highlighted style for active chat
                : "border-transparent hover:bg-gray-200")   // hover style for others
            }
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="overflow-hidden">
              <p className={"font-medium " + (user.id === activeUserId ? "text-blue-700" : "text-gray-800")}>
                {user.name}
              </p>
              {/* Last message preview (show "You: " prefix if last message was sent by me) */}
              {user.messages.length > 0 ? (
                <p className="text-sm text-gray-600 truncate">
                  {user.messages[user.messages.length - 1].self 
                    ? `You: ${user.messages[user.messages.length - 1].text}` 
                    : user.messages[user.messages.length - 1].text}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No messages yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/** Main Chat Area **/}
      <div className="flex flex-col flex-1 h-full">
        {/* Chat header with selected user info */}
        {activeUser && (
          <div className="flex items-center p-4 border-b bg-white">
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
            <h2 className="font-semibold text-gray-800">{activeUser.name}</h2>
          </div>
        )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeUser && activeUser.messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.self ? "justify-end" : ""}`}>
              {/* Avatar on the left for incoming messages */}
              {!msg.self && (
                <img 
                  src={activeUser.avatar} 
                  alt={activeUser.name} 
                  className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                />
              )}
              {/* Message bubble */}
              <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${msg.self ? "bg-blue-500 text-white" : "bg-white text-gray-800 border"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message input area */}
        {activeUser && (
          <div className="p-4 border-t bg-white flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); }}}
              ref={inputRef}
            />
            <button 
              onClick={handleSendMessage}
              disabled={messageInput.trim() === ""}
              className={
                "ml-3 px-4 py-2 font-semibold rounded-full " + 
                (messageInput.trim() === "" 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700")
              }
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
