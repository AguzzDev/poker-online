import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
} from "utils/yup";
import { useUser } from "context/User/UserProvider";
import fetchRegisterAdapter from "adapters/user/fetchRegisterAdapter";
import fetchLoginAdapter from "adapters/user/fetchLoginAdapter";
import {
  ChangePasswordInput,
  LayoutTypeEnum,
  LoginInput,
  LoginScreenTypeEnum,
  RegisterInput,
} from "models";
import { handleApiCall } from "utils/apiHelper";
import { Layout } from "../Layout/Layout";
import { LineOne } from "components/Line/LineOne";
import { Form } from "components/Form/Form";
import fetchChangePassword from "adapters/user/fetchChangePassword";
import { useRouter } from "next/router";
import Image from "next/image";
import { Error } from "components/Form/Error";

export const AuthPage = () => {
  let body;
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const [screen, setScreen] = useState<LoginScreenTypeEnum>(
    LoginScreenTypeEnum.login
  );
  const { setAccount } = useUser();

  const valuesRegister: RegisterInput = {
    username: "",
    email: "",
    password: "",
    password2: "",
    global: "",
  };
  const inputsRegister = [
    { name: "username" },
    { name: "email" },
    { name: "password", type: "password" },
    { name: "password2", type: "password" },
  ];
  const valuesLogin: LoginInput = {
    email: "",
    password: "",
    global: "",
  };
  const inputsLogin = [
    { name: "email" },
    { name: "password", type: "password" },
  ];
  const valuesChangePassword: ChangePasswordInput = {
    email: "",
    global: "",
  };
  const inputsChangePassword = [{ name: "email" }];

  useEffect(() => {
    if (router?.query?.error) {
      setError(router.query.error as string);
    }
  }, [router.query]);

  if (screen === LoginScreenTypeEnum.login) {
    body = (
      <section className="flex-col">
        <h2>Welcome Back!</h2>
        <h6 className="my-2">Continue with Google or enter your details</h6>
        <button
          className="flex items-center py-2 px-4 bg-secondary rounded-md"
          onClick={() => signIn("google")}
        >
          <Image src="/icons/GoogleIcon.png" width={24} height={24} />
          <span className="pl-2">Google</span>
        </button>
        <Error error={error} />
        <LineOne />

        <Formik
          initialValues={valuesLogin}
          validationSchema={loginValidation}
          onSubmit={async (values, { setErrors }) => {
            const res = await handleApiCall(
              () => fetchLoginAdapter(values),
              setErrors
            );
        
            if (res) {
              setAccount(res);
            }
          }}
        >
          {(props) => (
            <Form
              resetForm={props.resetForm}
              errors={props.errors.global}
              inputs={inputsLogin}
              buttonText="Log in"
              actionButton={[
                {
                  title: "Don’t have an account?",
                  text: "Sign in",
                  action: () => setScreen(LoginScreenTypeEnum.register),
                },
                {
                  title: "Reset your password",
                  text: "Reset",
                  action: () => setScreen(LoginScreenTypeEnum.resetPassword),
                },
              ]}
            />
          )}
        </Formik>
      </section>
    );
  }
  if (screen === LoginScreenTypeEnum.register) {
    body = (
      <section className="flex-col">
        <h2 className="mb-2">Welcome</h2>
        <LineOne />

        <Formik
          initialValues={valuesRegister}
          validationSchema={registerValidation}
          onSubmit={async (values, { setErrors }) => {
            const res = await handleApiCall(
              () => fetchRegisterAdapter(values),
              setErrors
            );

            if (res) {
              setScreen(LoginScreenTypeEnum.accountCreated);
            }
          }}
        >
          {(props) => (
            <Form
              resetForm={props.resetForm}
              errors={props.errors.global}
              inputs={inputsRegister}
              buttonText="Sign in"
              actionButton={[
                {
                  title: "Do you already have an account?",
                  text: "Log in",
                  action: () => setScreen(LoginScreenTypeEnum.login),
                },
              ]}
            />
          )}
        </Formik>
      </section>
    );
  }
  if (screen === LoginScreenTypeEnum.resetPassword) {
    body = (
      <section className="flex-col">
        <h2 className="mb-5">Reset your password</h2>

        <Formik
          initialValues={valuesChangePassword}
          validationSchema={changePasswordValidation}
          onSubmit={async (values, { setErrors }) => {
            const res = await handleApiCall(
              () => fetchChangePassword(values.email),
              setErrors
            );

            if (res) {
              setScreen(LoginScreenTypeEnum.resetPasswordSuccessful);
            }
          }}
        >
          {(props) => (
            <Form
              resetForm={props.resetForm}
              errors={props.errors.global}
              inputs={inputsChangePassword}
              buttonText="Reset"
              actionButton={[
                {
                  title: "Back to login?",
                  text: "Log in",
                  action: () => setScreen(LoginScreenTypeEnum.login),
                },
              ]}
            />
          )}
        </Formik>
      </section>
    );
  }
  if (screen === LoginScreenTypeEnum.accountCreated) {
    body = (
      <section>
        <h2 className="mb-5">Account Created</h2>
        <h5>Please check your email address to complete the registration</h5>
      </section>
    );
  }
  if (screen === LoginScreenTypeEnum.resetPasswordSuccessful) {
    body = (
      <section>
        <h2 className="mb-5">Check Your Email</h2>
        <h5>
          Check your inbox for further instructions to reset your password.
        </h5>
      </section>
    );
  }

  return <Layout type={LayoutTypeEnum.form}>{body}</Layout>;
};
