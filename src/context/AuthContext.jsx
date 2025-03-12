import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // ✅ Ensure both auth & db are imported
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // ✅ Import Firestore functions


//import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
    // ✅ Update Firebase Authentication Profile (displayName)
    await updateProfile(userCredential.user, { displayName: name });
  
    // ✅ Save user data to Firestore under "users" collection
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: name,
      email: email,
      uid: userCredential.user.uid,
      createdAt: new Date(),
    });
  
    return userCredential;
  };

  // const register = async (email, password, name) => {
  //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //   await updateProfile(userCredential.user, { displayName: name });
  //   return userCredential;
  // };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Make sure this function is exported correctly!
export const useAuth = () => useContext(AuthContext);
