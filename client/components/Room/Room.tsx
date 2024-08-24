import { RoomInterface } from "models";
import { formatBuyIn } from "utils/buyInOptions";

const Item = ({ title, data }: { title: string; data: number | string }) => (
  <div className="text-center">
    <h5>{title}</h5>
    <p>{data}</p>
  </div>
);

export const Room = ({ data }: { data: RoomInterface }) => {
  const { name, players, buyIn } = data;

  return (
    <article>
      <div className="flex py-3 border-2 border-white rounded-md overflow-hidden cursor-pointer">
        <div className="w-[15%] relative">
          <div className="absolute top-0 -left-1 w-full h-full bg-primary rounded-r-[100%] border-2 border-white"></div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h4>{name}</h4>

          <div className="flex space-x-5 pt-3">
            <Item title="Buy in" data={formatBuyIn(buyIn)} />
            <Item title="Blind" data={(1 * buyIn) / 100} />
            <Item title="Players" data={players} />
          </div>
        </div>
      </div>
    </article>
  );
};
