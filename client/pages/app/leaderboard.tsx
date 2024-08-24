import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { LayoutTypeEnum, NavbarTypeEnum } from "models";
import { GetServerSideProps, NextPage } from "next";
import { checkNoAuth } from "utils/checkNoAuth";

const Leaderboard: NextPage = () => {
  return (
    <Layout type={LayoutTypeEnum.app} navType={NavbarTypeEnum.app}>
      <Container style="h-full">Soon</Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;

  return await checkNoAuth(isLogged, "/");
};

export default Leaderboard
