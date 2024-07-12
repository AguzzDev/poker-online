import type { NextPage } from "next";

import { Inicio } from "components/Inicio";
import withAuth from "hooks/withAuth";
import Image from "next/image";

const Home: NextPage = () => {
  return <Inicio />;
};

export default withAuth(Home);
