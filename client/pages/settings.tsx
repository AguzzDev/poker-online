import { IconXs } from "components/Icon"
import { Layout } from "components/Layouts/Layout"
import { ModalChangePicture } from "components/Modal/ModalChangePicture"
import { useUser } from "context/UserContext"
import { NextPage } from "next"
import Image from "next/image"
import { MdEdit } from "react-icons/md"

const Settings: NextPage = () => {
  const { user } = useUser()

  return (
    <Layout>
      <h1>Configuración</h1>

      <section className="flex space-x-5 mt-2">
        <div className="w-3/6 rounded-md bg-white"></div>

        <div className="flex space-x-5 w-full bg-white p-5 rounded-md">
          <div className="group relative cursor-pointer">
            {!user?.image ? (
              <Image
                src="/noImage.png"
                height={150}
                width={150}
                objectFit="contain"
                className="rounded-full group-hover:opacity-90 duration-300"
              />
            ) : (
              <Image
                src={user?.image}
                height={150}
                width={150}
                objectFit="contain"
                className="rounded-full group-hover:opacity-90 duration-300"
              />
            )}
          <ModalChangePicture/>
          </div>
          <div className="mt-3">
            <div className="flex space-x-3">
              <h1>{user?.username}</h1>
              <button>
                <IconXs Icon={MdEdit} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Settings
