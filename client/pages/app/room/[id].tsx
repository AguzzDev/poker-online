import axios from "axios";
import { RoomPage } from "components/Pages/RoomPage";
import withGame from "hoc/withGame";
import { RoomInterface } from "models";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";

const Room: NextPage<any> = ({ data }: { data: RoomInterface }) => {
  return <RoomPage room={data} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room`);

  const paths = data.map(({ _id }) => ({
    params: {
      id: _id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/room/${params.id}`
  );

  return {
    props: {
      data,
    },
  };
};

export default withGame(Room);
