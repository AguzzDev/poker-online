import type { GetServerSideProps, NextPage } from "next";
import { AppPage } from "components/Pages/AppPage";
import { checkNoAuth } from "utils/checkNoAuth";
import "react-toastify/dist/ReactToastify.css";

const App: NextPage = () => {
  return <AppPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;

  return await checkNoAuth(isLogged, "/");
};

export default App;
