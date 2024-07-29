import { ChildrenType, UserInterface } from "models";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useState, useEffect, useContext } from "react";
import UserContext from "context/User/UserContext";

const UserProvider = ({ children }: { children: ChildrenType }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setAccount = (data) => {
    setCookie(null, "user", JSON.stringify(data), {
      maxAge: 30 * 24 * 60 * 60 * 3,
    });

    router.reload();
  };

  const removeAccount = () => {
    destroyCookie(null, "user");
    router.push("/auth");
    setUser(null);
  };

  const updateUser = (values: Partial<UserInterface>) => {
    const { user } = parseCookies();
    const userParse = JSON.parse(user);
    const update = { ...userParse, ...values };

    setUser(update);

    destroyCookie(null, "user");
    setCookie(null, "user", JSON.stringify(update), {
      maxAge: 30 * 24 * 60 * 60 * 3,
    });
  };

  useEffect(() => {
    const cookies = parseCookies();
    const userCookie = cookies.user ? JSON.parse(cookies.user) : null;
    setUser(userCookie);
    setLoading(false)
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, updateUser, removeAccount, setAccount }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);

export default UserProvider;
