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
      <section className="flex  h-full">
        <section className="w-1/4">
          <Container style="h-full">
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
        </section>

        <section className="flex flex-col-reverse lg:flex-row w-3/4 lg:space-x-5 pl-5">
          <Container style="flex-1 mt-5 lg:mt-0">
            <TextUnderline text="Soon" />
          </Container>
          <Container style="h-52 w-full lg:w-[30vw] lg:h-full">
            <Stadistics data={user.matches} />
          </Container>
        </section>
      </section>
    </Layout>
  );
};
