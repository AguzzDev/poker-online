import { ArrowUpIcon } from "@heroicons/react/20/solid";
import { IconSm } from "components/Icon";
import { FooterProps, FooterTypeEnum } from "models";
import Link from "next/link";
import { links } from "utils/links";

const LinkComponent = ({ link, title }: { link: string; title: string }) => {
  return (
    <Link href={link}>
      <a
        className="flex space-x-1 items-center group"
        rel="noreferrer"
        target="_blank"
      >
        <h5 className="group-hover:text-accent">{title}</h5>
        <IconSm
          Icon={ArrowUpIcon}
          props="transform rotate-45 group-hover:text-accent"
        />
      </a>
    </Link>
  );
};

export const Footer = ({ type = FooterTypeEnum.default }: FooterProps) => {
  return (
    <footer
      className={`${
        type === FooterTypeEnum.app ? "bg-secondary" : "bg-gray1"
      } w-full border-t  border-border`}
    >
      <div
        className={`${
          type === FooterTypeEnum.app ? "appScreenWidth" : "screenWidth"
        } flex flex-col sm:flex-row justify-between py-2`}
      >
        <h5>Develop by AguzzDev</h5>

        <div className="flex space-x-3">
          <LinkComponent link={links.portfolio} title="Portfolio" />
          <LinkComponent link={links.linkedin} title="LinkedIn" />
        </div>
      </div>
    </footer>
  );
};
