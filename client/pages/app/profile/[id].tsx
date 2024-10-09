import axios from "axios";
import { ProfilePage } from "components/Pages/ProfilePage";
import { UserInterface } from "models";
import { NextPage, GetServerSideProps } from "next";

const Profile: NextPage<{
  itsMyProfile: boolean;
  data: UserInterface;
}> = ({ data, itsMyProfile }) => {

  return <ProfilePage data={data} itsMyProfile={itsMyProfile} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}: any) => {
  const itsMyProfile = JSON.parse(req.cookies.user)._id === params.id;
  let user;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${params.id}`
    );
    user = data;
  } catch (error) {
    user = null;
  }

  if (!user) {
    return {
      redirect: {
        destination: "/app",
      },
      props: {},
    };
  }

  return {
    props: {
      data: user,
      itsMyProfile,
    },
  };
};

export default Profile;
