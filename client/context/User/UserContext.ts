import { UserContextType } from "models";
import { createContext } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;