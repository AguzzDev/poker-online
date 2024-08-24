import UserProvider from "context/User/UserProvider";
import { SessionProvider } from "next-auth/react";

interface Props {}

const withUserProvider = <T extends Props>(
  WrappedComponent: React.ComponentType<T>
) => {
  const withUserProvider = (props: T) => {
    return (
      <SessionProvider>
        <UserProvider>
          <WrappedComponent {...props} />
        </UserProvider>
      </SessionProvider>
    );
  };

  return withUserProvider;
};

export default withUserProvider;
