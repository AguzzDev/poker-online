import { IconSm } from "components/Icon";
import { Dropdown } from "./Dropdown";
import { Bars2Icon } from "@heroicons/react/20/solid";
import Link from "next/link";

export const UserNavbarDropdown = () => {
  const Item = ({ href, title }: { href: string; title: string }) => (
    <Link href={href}>
      <a className="block w-full h-full hover:text-primary active:text-primary">{title}</a>
    </Link>
  );

  return (
    <Dropdown
      trigger={
        <div className="block sm:hidden bg-primary rounded-full p-2">
          <IconSm Icon={Bars2Icon} />
        </div>
      }
      content={[
        <Item title="Profile" href="/app/profile" />,
        <Item title="Leaderboard" href="/app/leaderboard" />,
      ]}
    />
  );
};
