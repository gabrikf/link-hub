import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { UserContext, type User, type UserWithToken } from "./user-context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut(); // Firebase sign out
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    const newUser = {
      ...user,
      user: { ...user?.user, ...userData },
    } as UserWithToken;
    if (newUser) {
      setUser(newUser);
    }
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
