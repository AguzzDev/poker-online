import { Container } from "components/Container/Container";
import { ContainerTypeEnum } from "models";
import Link from "next/link";

const Item = ({ title, data }) => (
  <div className="text-center">
    <p className="text-xs">{title}</p>
    <p className="text-xs">{data}</p>
  </div>
);
export const RoomItem = ({ data, i }) => {
  const { name, players, buyIn } = data;

  return (
    <Link key={i} href={`/app/room/${data._id}`} passHref>
      <div className="flex py-3 h-max border-2 border-white rounded-md overflow-hidden cursor-pointer">
        <div className="w-[15%] relative">
          <div className="absolute top-0 -left-1 w-full h-full bg-primary rounded-r-[100%] border-2 border-white"></div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h5>{name}</h5>

          <div className="flex space-x-5">
            <Item title="Buy in" data={buyIn} />
            <Item title="Blind" data={(1 * buyIn) / 100} />
            <Item title="Players" data={players} />
          </div>
        </div>
      </div>
    </Link>
  );
};
