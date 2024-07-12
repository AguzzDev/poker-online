import { useEffect, useState } from "react";
import Router from "next/router";
import { useUser } from "context/User/UserProvider";

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    useEffect(() => {
      setLoading(false);
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      Router.push("/auth");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuth.getInitialProps = async (ctx) => {
    const wrappedComponentInitialProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps(ctx)
      : {};

    return { ...wrappedComponentInitialProps };
  };

  return WithAuth;
};

export default withAuth;
