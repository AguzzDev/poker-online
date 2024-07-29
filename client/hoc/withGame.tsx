import { useUser } from "context/User/UserProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";

const withGame = (WrappedComponent: React.FC) => {
  const withGame = (props) => {
    const router = useRouter();
    const { user, loading } = useUser();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/");
      }
    }, [loading]);

    if (loading || !user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return withGame;
};

export default withGame;
