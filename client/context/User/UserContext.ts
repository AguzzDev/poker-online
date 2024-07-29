import { UserContextType, UserInterface } from "models";
import { createContext } from "react";

const UserContext = createContext<UserContextType>({
  user: {} as UserInterface | null,
  updateUser: () => {},
  removeAccount: () => {},
  setAccount: () => {},
});

export default UserContext;
