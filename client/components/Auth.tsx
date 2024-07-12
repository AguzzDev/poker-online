import Image from "next/image";
import { useState } from "react";
import { Form, Formik } from "formik";

import { loginValidation, registerValidation } from "utils/yup";
import { useUser } from "context/User/UserProvider";
import { InputField } from "./Input/InputField";
import fetchRegisterAdapter from "adapters/user/fetchRegisterAdapter";
import fetchLoginAdapter from "adapters/user/fetchLoginAdapter";
import { LoginInput, RegisterInput } from "models";
import { handleApiCall } from "utils/apiHelper";

export const Auth = () => {
  const [screen, setScreen] = useState<number>(0);

  const { setAccount } = useUser();

  const valuesRegister: RegisterInput = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };
  const valuesLogin: LoginInput = {
    email: "",
    password: "",
  };

  return (
    <section className="flex flex-col h-screen">
      <Image
        src="/backgroundInicio.jpg"
        style={{ filter: "brightness(0.4)grayscale(100%)" }}
        layout="fill"
        objectFit="cover"
      />

      <section className="z-50 flex items-center justify-center h-full">
        <div className="flex max-w-3xl min-h-[420px] w-full bg-gray1 rounded-md">
          <div className="flex items-center justify-center w-2/6">
            <Image src="/aceLogo.png" height={200} width={200} />
          </div>
          <div className="w-4/6 p-5">
            {screen === 0 ? (
              <section className="flex flex-col justify-center h-full">
                <div>
                  <h1 className="text-4xl font-bold">Poker Online</h1>
                  <p>Nos alegra verte de nuevo 🥳</p>
                </div>
                <div className="w-full mt-2">
                  <Formik
                    initialValues={valuesLogin}
                    validationSchema={loginValidation}
                    onSubmit={async (values, { setErrors }) => {
                      handleApiCall(
                        fetchLoginAdapter,
                        values,
                        setAccount,
                        setErrors
                      );
                    }}
                  >
                    {({ resetForm }) => (
                      <Form>
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                        <InputField
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                        />

                        <button
                          type="submit"
                          className="w-full px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                          Ingresar
                        </button>

                        <div className="flex mt-2 space-x-3">
                          <p>No tienes una cuenta?</p>
                          <button
                            onClick={() => {
                              resetForm();
                              setScreen(1);
                            }}
                          >
                            Registrate
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </section>
            ) : (
              <section className="flex flex-col">
                <div>
                  <h1 className="text-4xl font-bold">Poker Online</h1>
                  <p>Registrate para empezar a jugar 🙂 </p>
                </div>
                <div className="w-full mt-2">
                  <Formik
                    initialValues={valuesRegister}
                    validationSchema={registerValidation}
                    onSubmit={async (values, { setErrors }) => {
                      handleApiCall(
                        fetchRegisterAdapter,
                        values,
                        setAccount,
                        setErrors
                      );
                    }}
                  >
                    {({ resetForm }) => (
                      <Form>
                        <InputField
                          name="username"
                          type="text"
                          placeholder="Nombre"
                        />
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                        <InputField
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                        />
                        <InputField
                          name="password2"
                          type="password"
                          placeholder="Confirmar contraseña"
                        />

                        <button
                          type="submit"
                          className="w-full px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                          Registrarse
                        </button>
                        <div className="flex mt-2 space-x-3">
                          <p>Ya tienes una cuenta?</p>
                          <button
                            onClick={() => {
                              resetForm();
                              setScreen(0);
                            }}
                          >
                            Logeate
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};
