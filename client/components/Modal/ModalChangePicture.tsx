import { IconSm } from "components/Icon";
import Image from "next/image";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Modal } from "./Modal";
import { getAvatars } from "utils/getAvatars";
import axios from "axios";
import { API_URL } from "utils/apiUrl";
import { useUser } from "context/User/UserProvider";
import { useRouter } from "next/router";

export const ModalChangePicture = () => {
  const [image, setImage] = useState<string>("");
  const { user } = useUser();

  const router = useRouter();

  const submit = async () => {
    if (image) {
      const { data } = await axios
        .create({
          baseURL: API_URL,
          headers: {
            token: `Bearer ${user?.accessToken}`,
          },
        })
        .put(`${API_URL}/user/changePicture`, { image });

      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        setImage("");
      }
    }
  };

  return (
    <div>
      <Modal
        button={
          <div
            className="w-32 h-32 flex items-center justify-center opacity-0 group-hover:opacity-100"
            style={{
              position: "absolute",
              top: "50%",
              right: "50%",
              transform: "translate(50%,-50%)",
            }}
          >
            <IconSm Icon={MdEdit} color="text-white" />
          </div>
        }
        content={
          <section className="bg-white rounded-md p-10">
            <div className="mb-3">
              <h1>Cambiar foto de perfil</h1>
            </div>
            <p>Elige uno de estos Avatares</p>
            <div className="grid grid-cols-5 gap-2 my-3">
              {getAvatars.map((avatar, i) => (
                <button key={i} onClick={() => setImage(avatar)}>
                  <Image
                    src={avatar}
                    width={100}
                    height={100}
                    objectFit="contain"
                  />
                </button>
              ))}
            </div>
            <button
              className="bg-black text-white font-bold w-full text-center py-2 rounded-md"
              onClick={submit}
            >
              Guardar
            </button>
          </section>
        }
      />
    </div>
  );
};
