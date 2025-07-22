import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  name?: string;
  description?: string;
  email: string;
  imgUrl: string;
}

export interface UserWithToken {
  user: User;
  token: string;
}

interface UserContextType {
  user: UserWithToken | null;
  setUser: (user: UserWithToken | null) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
