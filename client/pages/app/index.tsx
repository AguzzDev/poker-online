import type { NextPage } from "next";

import { HomePage } from "components/Pages/HomePage";
import withGame from "hoc/withGame";

const App: NextPage = () => {
  return <HomePage />;
};

export default withGame(App);
