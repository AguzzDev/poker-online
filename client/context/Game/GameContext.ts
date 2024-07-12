import { GameContextType } from "models";
import { createContext } from "react";

const GameContext = createContext<GameContextType | undefined>(undefined);

export default GameContext;
