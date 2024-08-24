import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useRouter } from "next/router";
import UserProvider from "context/User/UserProvider";
import GameProvider from "context/Game/GameProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  let body;
  const router = useRouter();
  const path = router.pathname;
  const appRoute = path.includes("/app") || path.includes("/dashboard");

  if (appRoute) {
    body = (
      <UserProvider>
        <GameProvider>
          <Component {...pageProps} />
        </GameProvider>
      </UserProvider>
    );
  } else {
    body = <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <title>Poker Online</title>
      </Head>

      <ToastContainer />

      {body}
    </>
  );
}

export default MyApp;
