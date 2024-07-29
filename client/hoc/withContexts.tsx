import GameProvider from "context/Game/GameProvider";
import UserProvider from "context/User/UserProvider";

const withContexts = (WrappedComponent) => {
  const withContexts = (props) => {
    return (
      <UserProvider>
        <GameProvider>
          <WrappedComponent {...props} />
        </GameProvider>
      </UserProvider>
    );
  };

  return withContexts;
};

export default withContexts;
