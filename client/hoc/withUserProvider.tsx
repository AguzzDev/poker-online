import UserProvider from "context/User/UserProvider";

const withUserProvider = (WrappedComponent: React.FC) => {
  const withUserProvider = (props) => {
    return (
      <UserProvider>
        <WrappedComponent {...props} />
      </UserProvider>
    );
  };

  return withUserProvider;
};

export default withUserProvider;
