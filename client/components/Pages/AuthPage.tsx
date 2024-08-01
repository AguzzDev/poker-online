import Image from "next/image";
import { useState } from "react";
import { Form, Formik } from "formik";
import { loginValidation, registerValidation } from "utils/yup";
import { useUser } from "context/User/UserProvider";
import { InputField } from "../Input/InputField";
import fetchRegisterAdapter from "adapters/user/fetchRegisterAdapter";
import fetchLoginAdapter from "adapters/user/fetchLoginAdapter";
import { LayoutTypeEnum, LoginInput, RegisterInput } from "models";
import { handleApiCall } from "utils/apiHelper";
import { Layout } from "../Layout/Layout";
import Logo from "public/Logo";
import { LineOne } from "components/Line/LineOne";
import { ButtonOne } from "components/Button/ButtonOne";

const Error = ({ error }: { error: string | undefined }) => (
  <>{error ? <p className="text-red-500">{error}</p> : <></>}</>
);

export const AuthPage = () => {
  const [screen, setScreen] = useState<number>(0);

  const { setAccount } = useUser();

  const valuesRegister: RegisterInput = {
    username: "",
    email: "",
    password: "",
    password2: "",
    global: "",
  };
  const valuesLogin: LoginInput = {
    email: "",
    password: "",
    global: "",
  };

  return (
    <Layout type={LayoutTypeEnum.empty}>
      <section className="flex flex-col-reverse lg:flex-row h-full">
        <section className="flex-col flex-1 lg:w-[45vw] py-5 px-10">
          <div className="h-[95%]">
            <Logo />

            <div className="mt-5">
              {screen === 0 ? (
                <section className="flex-col">
                  <h2>Welcome Back!</h2>
                  <h5 className="my-2">
                    Continue with Google or enter your details
                  </h5>
                  <LineOne />

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
                    {({ resetForm, errors }) => (
                      <Form className="flex flex-col space-y-2 md:space-y-8">
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                        <InputField
                          name="password"
                          type="password"
                          placeholder="Password"
                        />

                        <Error error={errors?.global} />

                        <ButtonOne type="submit">Log in</ButtonOne>

                        <div className="flex space-x-3">
                          <h5>Don’t have an account?</h5>
                          <button
                            className="font-bold hover:text-primary hover:opacity-90"
                            onClick={() => {
                              resetForm();
                              setScreen(1);
                            }}
                          >
                            <h5>Sign up</h5>
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </section>
              ) : (
                <section className="flex-col">
                  <h2 className="mb-2">We were waiting for you :)</h2>
                  <LineOne />

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
                    {({ resetForm, errors }) => (
                      <Form className="flex flex-col space-y-2 md:space-y-8">
                        <InputField
                          name="username"
                          type="text"
                          placeholder="Name"
                        />
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Email"
                        />
                        <InputField
                          name="password"
                          type="password"
                          placeholder="Password"
                        />
                        <InputField
                          name="password2"
                          type="password"
                          placeholder="Confirm your password"
                        />

                        <Error error={errors?.global} />

                        <ButtonOne type="submit">Sign in</ButtonOne>

                        <div className="flex space-x-3 pt-2">
                          <h5>Do you already have an account?</h5>
                          <button
                            className="text-xs font-bold hover:text-primary hover:opacity-90"
                            onClick={() => {
                              resetForm();
                              setScreen(0);
                            }}
                          >
                            <h5>Log in</h5>
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </section>
              )}
            </div>
          </div>

          <div className="flex items-end h-[5%]">Develop By AguzzDev</div>
        </section>

        <section className="h-1/4 lg:h-full lg:flex-1 relative rounded-b-[5%] md:rounded-l-[5%] overflow-hidden">
          <Image
            src="/cardsAuth.jpg"
            layout="fill"
            alt="Cards Image"
            className="saturate-25"
            objectFit="cover"
          />
        </section>
      </section>
    </Layout>
  );
};
