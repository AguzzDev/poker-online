import { AuthPage } from "components/Pages/AuthPage";
import withAuth from "hoc/withAuth";
import { GetServerSideProps } from "next";
import { checkAuth } from "utils/checkAuth";

const Auth = () => {
  return <AuthPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;

  return await checkAuth(isLogged, "/app");
};

export default withAuth(Auth);
