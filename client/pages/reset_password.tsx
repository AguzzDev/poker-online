import fetchResetPassword from "adapters/user/fetchResetPassword";
import { Form } from "components/Form/Form";
import { Layout } from "components/Layout/Layout";
import { useUser } from "context/User/UserProvider";
import { Formik } from "formik";
import withAuth from "hoc/withAuth";
import { LayoutTypeEnum, ResetPasswordInput } from "models";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { handleApiCall } from "utils/apiHelper";
import { checkAuth } from "utils/checkAuth";
import { resetPasswordValidation } from "utils/yup";

const ResetPassword: NextPage = () => {
  const { setAccount } = useUser();

  const { query } = useRouter();

  const values: ResetPasswordInput = {
    password: "",
    password2: "",
    global: "",
  };
  const inputs = [
    { name: "password", type: "password" },
    { name: "password2", type: "password" },
  ];
  return (
    <Layout type={LayoutTypeEnum.form}>
      <h2 className="mb-5">Change your password</h2>

      <Formik
        initialValues={values}
        validationSchema={resetPasswordValidation}
        onSubmit={async (values, { setErrors }) => {
          const token = query.token;

          const res = await handleApiCall(
            () => fetchResetPassword({ token, password: values.password }),
            setErrors
          );

          if (res) {
            setAccount(res.user);
          }
        }}
      >
        {(props) => (
          <Form
            resetForm={props.resetForm}
            errors={props.errors.global}
            inputs={inputs}
            buttonText="Change password"
          />
        )}
      </Formik>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogged = !!context.req.cookies.user;

  return await checkAuth(isLogged, "/app");
};

export default withAuth(ResetPassword);
