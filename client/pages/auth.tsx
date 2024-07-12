import { Auth } from "components/Auth";
import { Layout } from "components/Layouts/Layout";
import { LayoutWithoutNavbar } from "components/Layouts/LayoutWithoutNavbar";

const AuthPage = () => {
  return (
    <LayoutWithoutNavbar>
      <Auth />
    </LayoutWithoutNavbar>
  );
};

export default AuthPage;
