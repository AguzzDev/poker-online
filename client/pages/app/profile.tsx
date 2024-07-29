import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import withGame from "hoc/withGame";
import { LayoutTypeEnum, NavbarTypeEnum } from "models";
import { NextPage } from "next";

const Profile: NextPage = () => {
  return (
    <Layout type={LayoutTypeEnum.app} navType={NavbarTypeEnum.app}>
      <Container style="h-full">Soon</Container>
    </Layout>
  );
};

export default withGame(Profile);
