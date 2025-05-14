import React, { useEffect, useState, useRef } from "react";
import Chat from "./Chat";
import "./ChatPage.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  setDoc,
  deleteDoc
} from "firebase/firestore";

function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [messages, setMessages] = useState([]);
  const [hiredMaids, setHiredMaids] = useState([]);
  const [userChats, setUserChats] = useState([]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({ userId: user.uid, email: user.email });
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
        const unsubMaids = fetchHiredMaids(user.uid);
        fetchUserChats(user.uid);
        return () => unsubMaids();
      }
    });
    return () => unsub();
  }, []);

  const handleBackToHome = () => {
    if (userRole === "maid") {
      navigate("/maid-portal");
    } else {
      navigate("/home");
    }
  };

  const fetchHiredMaids = (userId) => {
    const q = query(collection(db, "HiredMaids"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const maids = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          maidId: data.maidId,
          name: data.maidName,
          photoURL: data.maidAvatar || "https://i.pravatar.cc/150?img=11",
          datetime: data.scheduledTime,
          status: data.status,
        };
      });
      setHiredMaids(maids);
    });
    return unsub;
  };

  const fetchUserChats = async (userId) => {
    const q = query(collection(db, "chats"), where("users", "array-contains", userId));
    const snapshot = await getDocs(q);
    const chats = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const otherUserId = data.users.find((uid) => uid !== userId);
      const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
      const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : {};
      return {
        chatId: docSnap.id,
        userId: otherUserId,
        name: otherUserData.name || "Unknown",
        photoURL: otherUserData.photoURL || "https://i.pravatar.cc/150?img=11"
      };
    }));
    setUserChats(chats);
  };

  const getOrCreateChat = async (otherUserId) => {
    const q = query(collection(db, "chats"), where("users", "array-contains", currentUser.userId));
    const snapshot = await getDocs(q);

    for (let docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.users.includes(otherUserId)) {
        setChatId(docSnap.id);
        return;
      }
    }

    const newChatRef = doc(collection(db, "chats"));
    await setDoc(newChatRef, {
      users: [currentUser.userId, otherUserId],
      createdAt: serverTimestamp(),
    });
    setChatId(newChatRef.id);
  };

  const handleDeleteChat = async () => {
    if (!chatId) return;
    try {
      await deleteDoc(doc(db, "chats", chatId));
      setChatId(null);
      setMessages([]);
      alert("Chat deleted successfully.");
    } catch (err) {
      alert("Failed to delete chat: " + err.message);
    }
  };

  const handleSelectMaid = async (maid) => {
    setSelectedUser(maid);
    setMessages([]);
    await getOrCreateChat(maid.maidId);
  };

  useEffect(() => {
    if (chatId) {
      const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
      const unsub = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
      return () => unsub();
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || !chatId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.userId,
      text: messageInput,
      createdAt: serverTimestamp(),
    });
    setMessageInput("");
  };

  const handleHireMaid = async () => {
    if (!selectedUser || !currentUser || !dateTime) {
      return alert("Please select a date and time.");
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser.userId,
        maidId: selectedUser.maidId,
        datetime: new Date(dateTime).toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Booking request sent!");
    } catch (err) {
      alert("Failed to hire maid: " + err.message);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      const docId = `${currentUser.userId}_${selectedUser.maidId}`;
      await setDoc(doc(db, "completedTasks", docId), {
        userId: currentUser.userId,
        maidId: selectedUser.maidId,
        status: "completed",
        timestamp: serverTimestamp(),
      });

      navigate("/tinder-shuffle/review", {
        state: {
          maidId: selectedUser.maidId,
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
        <button onClick={handleSignOut} className="chatPage__logoutButton">Logout</button>
        <button onClick={handleBackToHome} className="chatPage__backButton">⬅ Back to Home</button>

        <h3 style={{ color: "#f9fafb", margin: "1rem 0 0.5rem" }}>Your Hired Maids</h3>
        {hiredMaids.length === 0 ? (
          <p style={{ color: "#ccc", fontSize: "0.9rem" }}>No bookings yet</p>
        ) : (
          hiredMaids.map((maid) => (
            <div
              key={maid.maidId}
              onClick={() => handleSelectMaid(maid)}
              className={`chatPage__maidCard ${selectedUser?.maidId === maid.maidId ? "selected" : ""}`}
              style={{ cursor: "pointer", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <img src={maid.photoURL} alt={maid.name} style={{ width: 50, height: 50, borderRadius: "50%" }} />
              <div>
                <strong>{maid.name}</strong>
                <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
                  {maid.status} — {new Date(maid.datetime).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}

        <h3 style={{ color: "#f9fafb", margin: "1rem 0 0.5rem" }}>Chats</h3>
        {userChats.length === 0 ? (
          <p style={{ color: "#ccc", fontSize: "0.9rem" }}>No chats yet</p>
        ) : (
          userChats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => handleSelectMaid({ maidId: chat.userId, name: chat.name, photoURL: chat.photoURL })}
              className="chatPage__maidCard"
              style={{ cursor: "pointer", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <img src={chat.photoURL} alt={chat.name} style={{ width: 50, height: 50, borderRadius: "50%" }} />
              <div>
                <strong>{chat.name}</strong>
                <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
                  Active chat
                </p>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => navigate('/hired-maids')}
          style={{
            marginTop: "1rem",
            padding: "10px 14px",
            backgroundColor: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🧹 See Previously Hired Maids
        </button>
      </div>

      <div className="chatPage__chatWindow">
        {selectedUser ? (
          <>
            <div className="chatPage__messages">
              <h2>Chat with {selectedUser.name}</h2>
              {messages.map((msg, index) => {
                const isSent = msg.senderId === currentUser.userId;
                const timestamp = msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleString() : "";

                return (
                  <div
                    key={msg.id || index}
                    className={`chatPage__messageWrapper ${isSent ? "sent" : "received"}`}
                  >
                    <p className={`chatPage__message ${isSent ? "sent" : "received"}`}>{msg.text}</p>
                    <span className={`chatPage__timestamp ${isSent ? "sent" : "received"}`}>{timestamp}</span>
                  </div>
                );
              })}
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

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <label htmlFor="datetime" style={{ color: "#f9fafb", fontSize: "1rem", fontWeight: 500 }}>
                📅 Select date and time:
              </label>
              <input
                id="datetime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                style={{ backgroundColor: "#1f2937", color: "#f9fafb", border: "1px solid #374151", padding: "10px 14px", borderRadius: "8px", fontSize: "1rem", width: "100%", maxWidth: "300px", textAlign: "center" }}
              />
              <button onClick={handleHireMaid} style={{ backgroundColor: "#1d4ed8", color: "white", padding: "10px 18px", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
                📅 Hire This Maid
              </button>
            </div>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button onClick={handleMarkComplete} style={{ backgroundColor: "#04AA6D", color: "white", padding: "10px 18px", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
                ✅ Mark Task Complete & Leave Review
              </button>
            </div>
          </>
        ) : (
          <h2 style={{ color: "#f9fafb" }}>Select a chat to start messaging</h2>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
