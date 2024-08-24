import type { GetServerSideProps, NextPage } from "next";
import { LandingPage } from "components/Pages/LandingPage";
import { checkAuth } from "utils/checkAuth";

const Home: NextPage = () => {
  return <LandingPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;

  return await checkAuth(isLogged, "/app");
};

export default Home;
