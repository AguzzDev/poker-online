import { useRouter } from "next/router";
import { useEffect, FormEvent, useRef } from "react";

import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import Image from "next/image";

export const Chat = () => {
  const router = useRouter();
  const messageRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);

  const { newMessage, room, player } = useGame();

  const { user } = useUser();
  const id = router.query.id;

  const submitMessage = (e: FormEvent) => {
    e.preventDefault();
    const value = messageRef.current.value;

    if (value) {
      newMessage({
        image: user?.image,
        username: user?.username,
        message: value,
        id,
        userId: user?._id,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room.messages]);

  return (
    <section className="hidden xl:flex flex-col bg-primary border-l-borderWidth border-borderColor1 w-1/4">
      <div className="py-2 px-5">
        <h1 className="font-bold">Chat</h1>
      </div>

      <div className="flex flex-col space-y-3 px-5 py-2 h-full overflow-y-scroll">
        {room.messages.length > 0
          ? room.messages.map(({ image, message, username, time }, i) => (
              <div
                key={i}
                ref={scrollRef}
                className={`${
                  user.username === username ? "flex-row-reverse" : "flex-row"
                } flex space-x-3 items-start relative w-full`}
              >
                <div className="mr-7">
                  <div className="absolute top-0 w-8 h-8 bg-gray2 rounded-full">
                    <Image
                      src={image ? image : "/noImage.png"}
                      height={50}
                      width={50}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="w-10/12 px-3 py-1 rounded-lg border border-gray1 break-words">
                  <p>{message}</p>
                  <p className="text-gray-600 text-xs">{time}</p>
                </div>
              </div>
            ))
          : null}
      </div>

      {player ? (
        <div className="py-2 px-5">
          <div className="py-2 rounded-full">
            <form onSubmit={submitMessage}>
              <input type="text" placeholder="Mensaje..." ref={messageRef} />
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};
