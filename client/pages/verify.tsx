import type { NextPage } from "next";
import * as API from "services";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "components/Layout/Layout";
import { LayoutTypeEnum, UserInterface } from "models";
import { useUser } from "context/User/UserProvider";
import { AxiosError } from "axios";
import { useInterval } from "hooks/useInterval";
import withAuth from "hoc/withAuth";

const Verify: NextPage = () => {
  const router = useRouter();
  const [response, setResponse] = useState<{
    message: string;
    err?: boolean;
    user?: UserInterface | null;
  }>({
    message: "",
    err: false,
    user: null,
  });
  const { setAccount } = useUser();
  const { timer } = useInterval(5);

  useEffect(() => {
    const token = router.query.token;
    if (!token) return;

    const fetch = async () => {
      try {
        const { data } = await API.verify(token as string);
        setResponse({ message: data.message, user: data.user });
      } catch (error) {
        let err = error as AxiosError<{ message: string; statusCode: number }>;
        if (err.response! && err.response!.data) {
          setResponse({
            message: err.response.data.message,
            err: true,
          });
        }
      }
    };

    fetch();
  }, [router]);

  useEffect(() => {
    if (timer === 0) {
      if (response.err) {
        router.push("/auth");
      } else {
        setAccount(response.user as UserInterface);
        router.push("/app");
      }
    }
  }, [timer]);

  return (
    <Layout type={LayoutTypeEnum.form}>
      <section className="screenWidth">
        <h3>{response.message}</h3>
        {response.message ? (
          <p>
            Redirect to {response.err ? "Auth" : "App"} {timer}
          </p>
        ) : null}
      </section>
    </Layout>
  );
};

export default withAuth(Verify);
