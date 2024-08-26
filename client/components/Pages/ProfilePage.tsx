import { ButtonOne } from "components/Button/ButtonOne";
import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { Stadistics } from "components/Stats/Stadistics";
import { TextUnderline } from "components/Text/TextUnderline";
import { LayoutTypeEnum, UserInterface } from "models";
import Image from "next/image";
import { formatChips } from "utils/formatChips";

export const ProfilePage = ({ user }: { user: UserInterface }) => {
  return (
    <Layout type={LayoutTypeEnum.app}>
      <section className="flex space-x-5 h-full">
        <Container style="w-[20vw]">
          <TextUnderline text="Profile" />

          <section className="flex flex-col px-5 justify-center items-center mx-auto">
            <div className="relative profileShape w-32 h-36 bg-primary">
              <div className="absolute inset-0 m-auto profileShape bg-secondary w-[90%] h-[90%]">
                <div className="absolute inset-0 m-auto profileShape w-[80%] h-[80%]">
                  <div className="relative w-full h-full">
                    <Image src="/authImage.jpg" layout="fill" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center my-2">
              <h4>{user?.username}</h4>
              <h5>{formatChips(user!.chips)}</h5>
              <ButtonOne style="mt-2">Editar perfil</ButtonOne>
            </div>
          </section>
        </Container>
        <Container style="flex-1">
          <TextUnderline text="Soon" />
        </Container>
        <Container style="w-[30vw]">
          <Stadistics data={user.matches} />
        </Container>
      </section>
    </Layout>
  );
};
