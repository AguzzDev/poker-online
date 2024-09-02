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
      <section className="flex flex-col-reverse lg:flex-row lg:space-x-5 h-full">
        <Container style="flex flex-col w-full lg:w-4/6 flex-1">
          <div className="flex items-center justify-between mb-3">
            <TextUnderline text="Rooms" />

            <h4>Players online: {usersOnline}</h4>
          </div>

          {/* {adminRole ? (
            <ButtonOne onClick={() => router.push("/dashboard")}>
              Dashboard
            </ButtonOne>
          ) : null} */}

          <Rooms />
        </Container>

        <Container style="flex flex-col h-56 mb-5 lg:mb-0 lg:h-full">
          <Stadistics />
        </Container>
      </section>
    </Layout>
  );
};
