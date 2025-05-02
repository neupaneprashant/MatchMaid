import React, { useEffect, useState, useRef } from "react";
import Chat from "./Chat";
import "./ChatPage.css";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
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
  setDoc,
} from "firebase/firestore";

function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Hardcoded real Firebase UID of maid
  useEffect(() => {
    setUsers([
      {
        id: "BKlDajSgI0QXOk1zzIMdpW2nzql1", // Firebase UID of maid
        name: "Prasiddha Maid",
        avatar: "https://i.pravatar.cc/150?img=32",
      },
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
    const snapshot = await getDocs(q);

    for (let docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.users.includes(otherUser.id)) {
        setChatId(docSnap.id);
        return;
      }
    }

    const newChatRef = doc(collection(db, "chats"));
    await setDoc(newChatRef, {
      users: [currentUser.uid, otherUser.id],
      createdAt: serverTimestamp(),
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
      createdAt: serverTimestamp(),
    });
    setMessageInput("");
  };

  const handleMarkComplete = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      const docId = `${currentUser.uid}_${selectedUser.id}`; // must match Firestore rule key format
      await setDoc(doc(db, "completedTasks", docId), {
        userId: currentUser.uid,
        maidId: selectedUser.id,
        status: "completed",
        timestamp: serverTimestamp(),
      });

      navigate("/tinder-shuffle/review", {
        state: {
          maidId: selectedUser.id,
          maidName: selectedUser.name,
        },
      });
    } catch (err) {
      alert("Failed to mark task complete: " + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="chatPage">
      <div className="chatPage__sidebar">
        <h2><button onClick={handleSignOut} className="chatPage__logoutButton">Logout</button></h2>
        <h2><button onClick={() => navigate("/maid-portal")} className="chatPage__backButton">⬅ Back to Home</button></h2>
        {users.map((user) => (
          <div key={user.id} onClick={() => handleSelectUser(user)}>
            <Chat
              name={user.name}
              message="Tap to chat"
              profilePic={user.avatar}
            />
          </div>
        ))}
      </div>

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

            <div className="chatPage__inputContainer">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="chatPage__input"
              />
              <button onClick={handleSendMessage} className="chatPage__sendButton">Send</button>
            </div>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                onClick={handleMarkComplete}
                style={{
                  backgroundColor: "#04AA6D",
                  color: "white",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ✅ Mark Task Complete & Leave Review
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
