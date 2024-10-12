import { ButtonOne } from "./Button/ButtonOne";
import Logo from "public/Logo";
import Link from "next/link";
import { NavbarProps, NavbarTypeEnum } from "models";
import { useRouter } from "next/router";
import { UserNavbarDropdown } from "./Dropdown/UserNavbarDropdown";
import LogoMobile from "public/LogoMobile";
import { motion } from "framer-motion";
import { useUser } from "context/User/UserProvider";
import { links } from "utils/links";

const LogoIcon = () => (
  <>
    <Logo className="hidden lg:block" />
    <LogoMobile className="block lg:hidden" />
  </>
);

const NavLink = ({ href, text }: { href: string; text: string }) => {
  const { pathname } = useRouter();

  const condition = pathname.includes(text.toLowerCase());

  return (
    <Link href={href} passHref>
      <a className={`w-max ${condition ? "text-accent" : null}`}>
        <h5 className="hover:text-accent">{text}</h5>
        {condition ? (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 0.2, type: "tween" }}
            className="h-[.2em] bg-accent"
          ></motion.div>
        ) : (
          <div className="h-[.2em]"></div>
        )}
      </a>
    </Link>
  );
};

export const Navbar = ({ type = NavbarTypeEnum.default }: NavbarProps) => {
  let body = <></>;

  const { user } = useUser();

  if (type === NavbarTypeEnum.app) {
    body = (
      <nav className="flex justify-between px-3 md:px-5 py-2 border-2 border-border rounded-3xl bg-secondary my-3 md:my-5">
        <div className="flex space-x-5 items-center my-auto">
          <Link href={links.app} passHref>
            <a className="cursor-pointer">
              <LogoIcon />
            </a>
          </Link>

          <div className="hidden sm:flex space-x-3 mt-1">
            <NavLink text="Profile" href={`${links.profile}${user?._id}`} />
            <NavLink text="Leaderboard" href={links.leaderboard} />
          </div>
        </div>

        {user ? <UserNavbarDropdown /> : null}
      </nav>
    );
  } else {
    body = (
      <nav className="w-full flex items-center justify-between px-3 sm:px-10 py-2 border-2 border-border rounded-3xl bg-secondary my-5">
        <div className="my-auto">
          <LogoIcon />
        </div>

        <div>
          <Link href={links.auth} passHref>
            <a className="block">
              <ButtonOne>Play</ButtonOne>
            </a>
          </Link>
        </div>
      </nav>
    );
  }
  return body;
};
