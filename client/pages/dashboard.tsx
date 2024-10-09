import { DashboardPage } from "components/Pages/DashboardPage";
import type { GetServerSideProps, NextPage } from "next";
import * as API from "services";
import { checkNoAuth } from "utils/checkNoAuth";

const Dashboard: NextPage = () => {
  return <DashboardPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies.user) {
    return {
      props: {},
      redirect: { destination: "/" },
    };
  }

  const id = JSON.parse(context.req.cookies.user)._id;
  const { data } = await API.fetchDashboard(id);

  return await checkNoAuth(data, "/");
};

export default Dashboard;
