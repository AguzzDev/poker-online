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
    <section className="flex flex-col h-full border-2 border-border rounded-b-md md:rounded-md">
      <div className="py-2 px-5">
        <h4 className="font-bold">Chat</h4>
      </div>

      <div className="flex-col space-y-3 px-5 py-2 flex-1 overflow-y-scroll">
        {room.messages.length > 0
          ? room.messages.map(({ image, message, username, time }, i) => (
              <div
                key={i}
                ref={scrollRef}
                className={`${
                  user.username === username ? "flex-row-reverse" : "flex-row"
                } flex space-x-3 items-start relative w-full`}
              >
                <div className="relative w-8 h-8 bg-primary rounded-full">
                  <Image src={image ? image : "/noImage.png"} layout="fill" />
                </div>

                <div className="flex-1 px-3 py-1 rounded-lg border-borderWidth bg-purple1 border-border break-words">
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            ))
          : null}
      </div>

      {player ? (
        <div className="py-2 px-5">
          <div className="py-2 rounded-full">
            <form onSubmit={submitMessage}>
              <input type="text" placeholder="Message..." ref={messageRef} />
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};
