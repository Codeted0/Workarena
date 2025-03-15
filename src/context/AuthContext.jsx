import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // ✅ Ensure both auth & db are imported
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // ✅ Import Firestore functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // ✅ Store Firestore user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid); // ✅ Fetch user data when logged in
      } else {
        setUserData(null); // Clear user data on logout
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("🔥 Error fetching user data:", error);
    }
  };

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name }); // ✅ Update Firebase Auth displayName

    const userData = {
      name: name,
      email: email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      profession: "Not Set", // ✅ Default profession field
    };

    await setDoc(doc(db, "users", user.uid), userData); // ✅ Save user data to Firestore

    setUserData(userData); // ✅ Store in state immediately

    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(userCredential.user.uid); // ✅ Fetch user data on login
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null); // ✅ Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, userData, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Make sure this function is exported correctly!
export const useAuth = () => useContext(AuthContext);
