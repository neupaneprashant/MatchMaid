import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export const addToFavorites = async (userId, maidId) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      favorites: [maidId],
    });
  } else {
    const data = snap.data();
    const currentFavorites = data.favorites || [];

    if (!currentFavorites.includes(maidId)) {
      await updateDoc(userRef, {
        favorites: arrayUnion(maidId),
      });
    }
  }
};

