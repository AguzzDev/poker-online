import { useUser } from "context/User/UserProvider";
import { ButtonOne } from "./Button/ButtonOne";
import Logo from "public/Logo";
import Link from "next/link";
import { NavbarProps, NavbarTypeEnum } from "models";
import { useRouter } from "next/router";
import ChipsIcon from "public/icons/ChipsIcon";
import { formatChips } from "utils/formatChips";
import { IconSm } from "./Icon";
import { Bars2Icon } from "@heroicons/react/20/solid";
import { UserNavbarDropdown } from "./Dropdown/UserNavbarDropdown";
import LogoMobile from "public/LogoMobile";

const LogoIcon = () => (
  <>
    <Logo className="hidden sm:block" />
    <LogoMobile className="block sm:hidden" />
  </>
);

const NavLink = ({ href, text }) => {
  const { pathname } = useRouter();

  const condition = pathname === `/app/${text.toLowerCase()}`;

  return (
    <Link href={`/app${href}`} passHref>
      <a className={`w-max ${condition ? "text-accent" : null}`}>
        {text}
        {condition ? (
          <div className="h-[.2em] bg-accent w-3/4"></div>
        ) : (
          <div className="h-[.2em]"></div>
        )}
      </a>
    </Link>
  );
};

export const Navbar = ({ type = NavbarTypeEnum.default }: NavbarProps) => {
  const { user } = useUser();

  const { chips, username } = user!;

  let body = <></>;

  if (type === NavbarTypeEnum.app) {
    body = (
      <section className="flex justify-between px-3 sm:px-10 py-2 border-2 border-border rounded-3xl bg-secondary my-5">
        <div className="flex space-x-3 items-center my-auto">
          <Link href="/app" passHref>
            <a className="cursor-pointer">
              <LogoIcon />
            </a>
          </Link>

          <div className="hidden sm:flex space-x-3 mt-1">
            <NavLink text="Profile" href="/profile" />
            <NavLink text="Leaderboard" href="/leaderboard" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-col text-end">
            <h5 className="font-bold">{username}</h5>
            <div className="flex items-center space-x-0 md:space-x-2">
              <ChipsIcon className="scale-50 sm:scale-100" />
              <p className="text-sm">{formatChips(chips)}</p>
            </div>
          </div>
          <div className="hidden sm:block w-14 h-full bg-black"></div>

          <UserNavbarDropdown />
        </div>
      </section>
    );
  } else {
    body = (
      <section className="w-full flex items-center justify-between px-3 sm:px-10 py-2 border-2 border-border rounded-3xl bg-secondary my-5">
        <div className="my-auto">
          <LogoIcon />
        </div>

        <div>
          <Link href="/auth" passHref>
            <a className="block">
              <ButtonOne>Play</ButtonOne>
            </a>
          </Link>
        </div>
      </section>
    );
  }
  return body;
};
