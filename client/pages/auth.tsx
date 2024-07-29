import { AuthPage } from "components/Pages/AuthPage";
import withAuth from "hoc/withAuth";

const Auth = () => {
  return <AuthPage />;
};

export default withAuth(Auth)
