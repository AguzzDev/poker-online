import { Dropdown } from "./Dropdown";
import Link from "next/link";
import { formatChips } from "utils/formatChips";
import ChipsIcon from "public/icons/ChipsIcon";
import { useUser } from "context/User/UserProvider";
import { UserImage } from "utils/userImage";
import { links } from "utils/links";

export const UserNavbarDropdown = () => {
  const { user, removeAccount } = useUser();

  const { chips, username, image } = user!;

  const Item = ({
    href,
    title,
    action,
  }: {
    action?: Function;
    href?: string;
    title: string;
  }) => (
    <>
      {action ? (
        <button
          className=" hover:text-accent active:text-accent"
          onClick={() => action()}
        >
          {title}
        </button>
      ) : (
        <Link href={href!}>
          <a className=" hover:text-accent active:text-accent">{title}</a>
        </Link>
      )}
    </>
  );

  const Trigger = () => (
    <>
      <div className="flex-col text-end">
        <h5 className="font-bold">{username}</h5>
        <div className="flex items-center space-x-0 md:space-x-1">
          <ChipsIcon className="scale-50 sm:scale-75" />
          <h6>{formatChips(chips)}</h6>
        </div>
      </div>

      <div className="hidden sm:block relative w-16 h-16 bg-black1 rounded-md overflow-hidden">
        <UserImage image={image} />
      </div>
    </>
  );

  return (
    <>
      <div className="hidden sm:block">
        <Dropdown
          trigger={<Trigger />}
          content={[<Item key="1" title="Logout" action={removeAccount} />]}
          size={40}
        />
      </div>
      <div className="block sm:hidden">
        <Dropdown
          trigger={<Trigger />}
          content={[
            <Item
              key="2"
              title="Profile"
              href={`${links.profile}${user?._id}`}
            />,
            <Item key="3" title="Leaderboard" href={links.leaderboard} />,
            <Item key="4" title="Logout" action={removeAccount} />,
          ]}
          size={40}
        />
      </div>
    </>
  );
};
