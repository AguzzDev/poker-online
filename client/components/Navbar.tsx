import { useUser } from "context/User/UserProvider";

export const Navbar = () => {
  const { user } = useUser();

  return (
    <section className="sticky top-0 w-full bg-background py-2 border-b-borderWidth border-borderColor1">
      <div className="max-w-6xl px-5 lg:px-0 mx-auto flex justify-between">
        <h1 className="my-auto">Poker Online</h1>

        <div>
          <h2>{user?.username}</h2>
          <p className="text-xs">{user?.chips} chips</p>
        </div>
      </div>
    </section>
  );
};
