import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase'; // ✅ make sure you're exporting auth & db
import './chatPage.css';

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // 🔐 Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 📥 Get all users except self
  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const otherUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.uid !== user.uid);
      setUsers(otherUsers);
    };
    fetchUsers();
  }, [user]);

  // 💬 Get messages for selected chat
  useEffect(() => {
    if (!user || !selectedUser) return;

    const roomId = [user.uid, selectedUser.uid].sort().join('_'); // Unique room
    const q = query(
      collection(db, 'chats', roomId, 'messages'),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedUser) return;

    const roomId = [user.uid, selectedUser.uid].sort().join('_');
    await addDoc(collection(db, 'chats', roomId, 'messages'), {
      text: message,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName || 'Anonymous',
    });
    setMessage('');
  };

  return (
    <div className="chat-container flex h-screen">
      {/* Sidebar User List */}
      <div className="w-1/3 border-r overflow-y-auto p-4 bg-white shadow">
        <h2 className="text-lg font-bold mb-4">Messages</h2>
        {users.map((u) => (
          <div
            key={u.uid}
            className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${selectedUser?.uid === u.uid ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedUser(u)}
          >
            {u.displayName || 'Unnamed User'}
          </div>
        ))}
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col p-4">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">
              Chat with {selectedUser.displayName || 'Anonymous'}
            </h2>

            <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${msg.uid === user.uid ? 'text-right' : 'text-left'}`}
                >
                  <p className="text-sm font-semibold">{msg.displayName}</p>
                  <p className="inline-block px-3 py-1 bg-white rounded shadow">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex">
              <input
                className="flex-1 p-2 border rounded-l"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 rounded-r" type="submit">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="text-gray-500 flex-1 flex items-center justify-center">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
