import { useEffect } from "react";
import { useRouter } from "next/router";
import withUserProvider from "./withUserProvider";
import { useUser } from "context/User/UserProvider";
import { useSession } from "next-auth/react";
import { UserInterface } from "models";

interface Props {}

const withAuth = <T extends Props>(
  WrappedComponent: React.ComponentType<T>
) => {
  const withAuth = (props: T) => {
    const router = useRouter();

    const { data: session } = useSession();
    const { user, setAccount } = useUser();

    useEffect(() => {
      if (session && !user) {
        setAccount(session.user as UserInterface);
      }
    }, [session]);

    useEffect(() => {
      if (user) {
        router.push("/app");
      }
    }, [router, user]);

    if (user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return withUserProvider(withAuth);
};

export default withAuth;
