import axios from "axios";
import { RoomPage } from "components/Pages/RoomPage";
import { RoomInterface } from "models";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const Room: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const cookie = parseCookies();
    if (!cookie.user) router.push("/");
  }, []);

  return <RoomPage />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data }: { data: RoomInterface[] } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/room`
  );

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

export default Room
