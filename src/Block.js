import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";

// Toggle block state
export const blockUser = async (maidId, userId) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error("User not found");

  const currentBlocked = snap.data().blockedMaids || [];

  if (currentBlocked.includes(maidId)) {
    // Unblock
    await updateDoc(userRef, {
      blockedMaids: arrayRemove(maidId),
    });
    return false; // not blocked anymore
  } else {
    // Block
    await updateDoc(userRef, {
      blockedMaids: arrayUnion(maidId),
    });
    return true; // now blocked
  }
};

// Check block status
export const isUserBlocked = async (userId, maidId) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  const blocked = snap.data().blockedMaids || [];
  return blocked.includes(maidId);
};
