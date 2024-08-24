export const checkNoAuth = (condition: unknown, redirect: string) => {
  if (!condition) {
    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
