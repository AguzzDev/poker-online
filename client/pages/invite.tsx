import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

const Invite: NextPage<{ params: { ref: string; id: string } }> = ({
  params,
}) => {
  return (
    <>
      <Head>
        <title>{params.ref} invited you to a room</title>
      </Head>

      <></>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;
  const params = context.query;

  return {
    props: { params },
    redirect: {
      destination: isLogged ? `/app/room/${params.id}` : "/auth",
      permanent: false,
    },
  };
};

export default Invite;
