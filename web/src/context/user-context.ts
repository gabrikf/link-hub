import { createContext } from "react";

export interface User {
  id: string;
  username: string;
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
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
