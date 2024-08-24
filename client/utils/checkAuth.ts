export const checkAuth = (condition: unknown, redirect: string) => {
  if (condition) {
    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
