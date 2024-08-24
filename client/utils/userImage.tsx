import { UserIcon } from "@heroicons/react/20/solid";
import { IconMd } from "components/Icon";
import Image from "next/image";

export const UserImage = ({
  image,
  ...props
}: {
  image: string;
  className?: string;
}) => {
  return (
    <>
      {image === "default" ? (
        <div className="flex items-center justify-center h-full">
          <div {...props}>
            <IconMd Icon={UserIcon} />
          </div>
        </div>
      ) : (
        <Image src={`/avatars/${image}.png`} alt="Player image" layout="fill" />
      )}
    </>
  );
};
