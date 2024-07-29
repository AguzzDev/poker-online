import { useEffect } from "react";
import { useRouter } from "next/router";
import withUserProvider from "./withUserProvider";
import { useUser } from "context/User/UserProvider";

const withAuth = (WrappedComponent: React.FC) => {
  const withAuth = (props) => {
    const router = useRouter();
    const { user, loading } = useUser();
    const condition = user && router.pathname == "/auth";

    useEffect(() => {
      if (!loading && condition) {
        router.push("/app");
      }
    }, [loading]);

    if (loading || condition) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return withUserProvider(withAuth);
};

export default withAuth;
