import { ButtonOne } from "components/Button/ButtonOne";
import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { Stadistics } from "components/Stats/Stadistics";
import { TextUnderline } from "components/Text/TextUnderline";
import { LayoutTypeEnum, UserInterface } from "models";
import { formatChips } from "utils/formatChips";
import { UserImage } from "utils/userImage";
import { Missions } from "components/Missions";
import { useUser } from "context/User/UserProvider";
import { useEffect, useState } from "react";

export const ProfilePage = ({
  data,
  itsMyProfile,
}: {
  itsMyProfile: boolean;
  data: UserInterface | null;
}) => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserInterface | null>(null);

  useEffect(() => {
    if (!user) return;

    if (itsMyProfile) {
      setUserData(user);
    } else {
      setUserData(data);
    }
  }, [user]);

  if (!user || !userData) return <></>;

  return (
    <Layout type={LayoutTypeEnum.app}>
      <section className="flex flex-col sm:flex-row h-full">
        <section className="sm:w-1/4">
          <Container style="h-full">
            <TextUnderline text="Profile" />

            <section className="mt-5 flex flex-col px-5 justify-center items-center mx-auto">
              <div className="relative profileShape w-28 h-32 md:w-32 md:h-36 bg-primary">
                <div className="absolute inset-0 m-auto profileShape bg-secondary w-[90%] h-[90%]">
                  <div className="absolute inset-0 m-auto profileShape w-[80%] h-[80%]">
                    <div className="relative w-full h-full">
                      <UserImage image={userData.image} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-center items-center my-2">
                <h4>{userData.username}</h4>
                <h5>{formatChips(userData.chips)}</h5>
                {itsMyProfile ? (
                  <ButtonOne className="mt-2">Editar perfil</ButtonOne>
                ) : null}
              </div>
            </section>
          </Container>
        </section>

        <section className="flex flex-col-reverse lg:flex-row sm:w-3/4 lg:space-x-5 sm:pl-5">
          <Container style="flex flex-col sm:mt-5 lg:mt-0 sm:flex-1 h-40 sm:h-full">
            {itsMyProfile ? <Missions /> : null}
          </Container>
          <Container style="my-5 sm:my-0 h-56 w-full lg:w-[30vw] lg:h-full">
            <Stadistics data={userData.matches} />
          </Container>
        </section>
      </section>
    </Layout>
  );
};
