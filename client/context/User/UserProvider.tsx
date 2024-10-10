import { ChildrenType, UserInterface } from "models";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useState, useEffect, useContext } from "react";
import UserContext from "context/User/UserContext";
import { signOut } from "next-auth/react";
import * as API from "services";

const UserProvider = ({ children }: { children: ChildrenType }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [adminRole, setAdminRole] = useState<boolean>(false);
  const cookies = parseCookies();

  const setAccount = (data: UserInterface) => {
    if (cookies.user) return;

    setCookie(null, "user", JSON.stringify(data), {
      maxAge: 30 * 24 * 60 * 60 * 3,
      path: "/",
    });
    router.replace(router.asPath);
  };

  const removeAccount = () => {
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; max-age=0; path=/;`;
    });

    setTimeout(() => {
      if (user?.provider) {
        signOut({ callbackUrl: "/" });
      } else {
        router.reload();
      }
    }, 500);
  };

  const updateUser = (values: Partial<UserInterface>) => {
    const { user } = parseCookies();
    const userParse = JSON.parse(user);
    const update = { ...userParse, ...values };

    setUser(update);

    destroyCookie(null, "user");
    setCookie(null, "user", JSON.stringify(update), {
      maxAge: 30 * 24 * 60 * 60 * 3,
      path: "/",
    });
  };

  useEffect(() => {
    const cookies = parseCookies();
    const userCookie = cookies.user ? JSON.parse(cookies.user) : null;
    setUser(userCookie);
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      try {
        const { data } = await API.fetchDashboard(user!._id);

        setAdminRole(data);
      } catch (error) {
        setAdminRole(false);
      }
    };

    fetch();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        adminRole,
        updateUser,
        removeAccount,
        setAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);

export default UserProvider;
