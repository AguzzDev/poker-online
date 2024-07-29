import * as Tooltip from "@radix-ui/react-tooltip";
import { GiPokerHand } from "react-icons/gi";
import { IoIosSettings, IoIosPodium } from "react-icons/io";
import { ImSpinner4 } from "react-icons/im";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

import { IconSm } from "components/Icon";
import { useUser } from "context/UserContext";

interface Props {
  title: string;
  link?: string;
  id?: string;
  children: JSX.Element;
}

export const Sidebar = () => {
  const { removeAccount } = useUser();

  const Button = ({ children, link, title, id }: Props) => {
    return (
      <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
        <Tooltip.Root>
          <Tooltip.Trigger
            onClick={() => id === "closeSession" && removeAccount()}
          >
            {link ? (
              <Link href={link}>
                <a>{children}</a>
              </Link>
            ) : (
              <p>{children}</p>
            )}
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            sideOffset={10}
            className="bg-gray-600 p-2"
          >
            <Tooltip.Arrow
              className="fill-current text-gray-600"
              width={20}
              height={10}
            />
            <p className="text-white">{title}</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  };

  return (
    <section className="h-screen bg-white shadow-xl w-[5%] flex-col justify-between items-center py-10">
      <div className="flex-col space-y-6">
        <Button
          title="Inicio"
          link="/"
          children={<IconSm Icon={GiPokerHand} color="text-gray-600" />}
        />
        <Button
          title="Tabla de Posiciones"
          link="/scoreboard"
          children={<IconSm Icon={IoIosPodium} color="text-gray-600" />}
        />
        <Button
          title="Ruleta"
          link="/spin"
          children={<IconSm Icon={ImSpinner4} color="text-gray-600" />}
        />
      </div>

      <div className="flex-col space-y-6">
        <Button
          title="Configuracion"
          link="/settings"
          children={<IconSm Icon={IoIosSettings} color="text-gray-600" />}
        />
        <Button
          id="closeSession"
          title="Cerrar sesión"
          children={<IconSm Icon={MdLogout} color="text-gray-600" />}
        />
      </div>
    </section>
  );
};
