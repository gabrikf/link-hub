import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { UserContext, type UserWithToken } from "./user-context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut(); // Firebase sign out
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
