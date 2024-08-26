import axios from "axios";
import { ProfilePage } from "components/Pages/ProfilePage";
import { UserInterface } from "models";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const Profile: NextPage = ({ data }) => {
  const router = useRouter();

  useEffect(() => {
    const cookie = parseCookies();
    if (!cookie.user) router.push("/");
  }, []);

  return <ProfilePage user={data} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data }: { data: UserInterface[] } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user`
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
    `${process.env.NEXT_PUBLIC_API_URL}/user/${params.id}`
  );

  return {
    props: {
      data,
    },
  };
};

export default Profile;
