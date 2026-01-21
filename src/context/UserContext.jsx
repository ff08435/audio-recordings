import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("burushaski_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem("burushaski_user");
      }
    }
    setLoading(false);
  }, []);

  // Save user whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("burushaski_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("burushaski_user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
