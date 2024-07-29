import type { AppProps } from "next/app";

import "../styles/globals.css";

import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import UserProvider from "context/User/UserProvider";
import GameProvider from "context/Game/GameProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAppRoute = router.pathname.startsWith("/app");

  return (
    <div>
      {isAppRoute ? (
        <UserProvider>
          <GameProvider>
            <Component {...pageProps} />
          </GameProvider>
        </UserProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  );
}

export default MyApp;
