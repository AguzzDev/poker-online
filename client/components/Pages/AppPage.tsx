import { Layout } from "components/Layout/Layout";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import { LayoutTypeEnum } from "models";
import { Container } from "components/Container/Container";
import { TextUnderline } from "components/Text/TextUnderline";
import { ButtonOne } from "components/Button/ButtonOne";
import { useRouter } from "next/router";
import { Rooms } from "components/Room/Rooms";
import { Stadistics } from "components/Stats/Stadistics";

export const AppPage = () => {
  const router = useRouter();
  const { adminRole } = useUser();
  const { usersOnline } = useGame();

  return (
    <Layout type={LayoutTypeEnum.app}>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-5 h-full">
        <Container style="flex flex-col w-full xl:w-4/6 h-full md:h-full">
          <div className="flex items-center justify-between mb-3">
            <TextUnderline text="Rooms" />

            <h4>Players online: {usersOnline}</h4>
          </div>

          {adminRole ? (
            <ButtonOne onClick={() => router.push("/dashboard")}>
              Dashboard
            </ButtonOne>
          ) : null}

          <Rooms />
        </Container>

        <Container style="flex flex-col h-80 xl:flex-1 xl:h-full mb-5 xl:mb-0">
          <Stadistics />
        </Container>
      </section>
    </Layout>
  );
};
