import React, { useEffect, useState, useRef } from "react";
import Chat from "./Chat";
import "./ChatPage.css";
import { useNavigate } from 'react-router-dom';
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  onSnapshot,
  orderBy,
  setDoc
} from "firebase/firestore";

function ChatPage({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState(""); 
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   const fetchSwipedUsers = async () => {
  //     const q = query(collection(db, "swipes"), where("swiper", "==", currentUser.uid));
  //     const swipeSnapshot = await getDocs(q);
  //     const swipedUserIds = swipeSnapshot.docs.map(doc => doc.data().swiped);

  //     const userDocs = await getDocs(collection(db, "users"));
  //     const fetchedUsers = userDocs.docs
  //       .map(doc => ({ id: doc.id, ...doc.data() }))
  //       .filter(u => u.id !== currentUser.uid && swipedUserIds.includes(u.id));

  //     setUsers(fetchedUsers);
  //   };

  //   fetchSwipedUsers();
  // }, [currentUser]);
  
  //temporary hardcoded users
  useEffect(() => {
    setUsers([
      { id: "test1", name: "Ana Malbasa", avatar: "https://i.pravatar.cc/150?img=32" },
      { id: "test2", name: "Paul Osmond", avatar: "https://i.pravatar.cc/150?img=47" }
    ]);
  }, []);
  
  

  useEffect(() => {
    if (chatId) {
      const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
      return () => unsubscribe();
    }
  }, [chatId]);

  const getOrCreateChat = async (otherUser) => {
    const q = query(collection(db, "chats"), where("users", "array-contains", currentUser.uid));
    const querySnapshot = await getDocs(q);

    for (let docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (data.users.includes(otherUser.id)) {
        setChatId(docSnap.id);
        return;
      }
    }

    const newChatRef = doc(collection(db, "chats"));
    await setDoc(newChatRef, {
      users: [currentUser.uid, otherUser.id],
      createdAt: serverTimestamp()
    });
    setChatId(newChatRef.id);
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    await getOrCreateChat(user);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || !chatId) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      text: messageInput,
      createdAt: serverTimestamp()
    });
    setMessageInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatPage">
      {/* Sidebar */}
      <div className="chatPage__sidebar">
        <h2>Chats <button onClick={() => navigate('/home')} className="chatPage__backButton"> ⬅ Back to home</button></h2>
        {users.map((user) => (
          <div key={user.id} onClick={() => handleSelectUser(user)}>
            <Chat
              name={user.name}
              message="Tap to chat"
              profilePic={user.avatar || "https://via.placeholder.com/150"}
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
              {messages.map((msg, index) => (
                <p
                  key={msg.id || index}
                  className={`chatPage__message ${msg.senderId === currentUser.uid ? "sent" : "received"}`}
                >
                  {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
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