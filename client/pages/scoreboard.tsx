import { Layout } from "components/Layouts/Layout"
import { NextPage } from "next"
import { formatPrice } from "utils/formatPrice"

interface Props {
  top: number
  username: string
  chips: number
}

const Scoreboard: NextPage = () => {
  const Ranking = ({ top, username, chips }: Props) => {
    return (
      <div className="flex flex-col w-full">
        <div className="w-20 h-20 mx-auto bg-red-500 rounded-full mb-3"></div>
        <div
          className={`${
            top === 1 ? "h-40" : "h-20"
          } flex flex-col justify-center items-center bg-black text-white`}
        >
          <h1 className="text-5xl">{top}</h1>
          <p>
            {username} - {formatPrice(chips)}
          </p>
        </div>
      </div>
    )
  }
  return (
    <Layout>
      <h1>Tabla de posiciones</h1>
      <div className="w-full bg-white rounded-md p-5 h-full mt-2">
        <div className="w-8/12 mx-auto">
          <div className="flex items-end justify-between mx-auto">
            <Ranking top={2} username="Juan" chips={100} />
            <Ranking top={1} username="Pedro" chips={400} />
            <Ranking top={3} username="Luis" chips={200} />
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-3 text-center">
              <h2>Posicion</h2>
              <h2>Usuario</h2>
              <h2>Dinero</h2>
            </div>

            {Array.from({ length: 26 }).map((_, index) => (
              <>
                {index > 2 && (
                  <div className="grid grid-cols-3 text-center">
                    <p>{index + 1}</p>
                    <p className="truncate w-full">Juan</p>
                    <p>{formatPrice(300)}</p>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Scoreboard
