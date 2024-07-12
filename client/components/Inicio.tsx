import { Layout } from "components/Layouts/Layout";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import Image from "next/image";
import Link from "next/link";
import { NewRoomModal } from "./Modal/NewRoomModal";
import { JoinRoomModal } from "./Modal/JoinRoomModal";

interface PropsStats {
  title: string;
  value: number | undefined;
}

export const Inicio = () => {
  const { user } = useUser();
  const { usersOnline, rooms } = useGame();

  const Stats = ({ title, value }: PropsStats) => {
    return (
      <div
        className={`${
          title === "Loses" ? "flex-row-reverse" : "flex-row"
        } flex items-center justify-between`}
      >
        <h3>{title}</h3>
        <p className="px-2 font-bold">{value}</p>
      </div>
    );
  };

  return (
    <Layout>
      <section className="flex space-x-5">
        {/* Left */}
        <section className="flex flex-col w-4/6 p-5 bg-primary border1 rounded-md">
          <Link href="/play/offline">
            <button className="mb-2 buttonStyle1">
              Juga contra la maquina
            </button>
          </Link>
          <NewRoomModal />
          <div>
            <div className="flex justify-between py-3">
              <h1>Salas</h1>
              <h3>Jugadores online: {usersOnline}</h3>
            </div>
            <div className="flex flex-col space-y-3">
              {rooms &&
                rooms.map(({ desk, name, buyIn, _id }, i: any) => (
                  <div className="flex items-center justify-between" key={i}>
                    <p>{name}</p>
                    <p>
                      Jugadores:
                      <span className="ml-2">{desk.players.length}</span>
                    </p>
                    <p>{buyIn}</p>
                    <JoinRoomModal hasPassword={false} id={_id} />
                  </div>
                ))}
            </div>
          </div>
        </section>
        {/* Right */}
        <section className="flex flex-col w-2/6">
          <div className="h-full p-5 bg-primary border-[.1rem] border-[#313142] rounded-md">
            <div className="flex flex-col">
              <h1>Tu historial</h1>
              <div className="flex justify-between mt-5">
                <Stats title="Wins" value={user.matches.wins} />
                <Stats title="Loses" value={user.matches.loses} />
              </div>
              <div className="flex flex-col mt-5 space-y-5">
                <Stats title="Ganadas con par" value={user.matches.par} />
                <Stats title="Ganadas con trio" value={user.matches.trio} />
                <Stats title="Ganadas con full" value={user.matches.full} />
                <Stats title="Ganadas con poker" value={user.matches.poker} />
                <Stats title="Ganadas con color" value={user.matches.flush} />
                <Stats
                  title="Ganadas con escalera"
                  value={user.matches.straight}
                />
                <Stats
                  title="Ganadas con escalera de color"
                  value={user.matches.straightFlush}
                />
                <Stats
                  title="Ganadas con escalera real"
                  value={user.matches.straightFlushReal}
                />
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
};
