import type { AppProps } from "next/app";

import "../styles/globals.css";
import UserProvider from "context/User/UserProvider";
import GameProvider from "context/Game/GameProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </UserProvider>
  );
}

export default MyApp;
