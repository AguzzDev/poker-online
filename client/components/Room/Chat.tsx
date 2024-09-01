import { useRouter } from "next/router";
import { useEffect, FormEvent, useRef } from "react";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import { UserImage } from "utils/userImage";
import { getCard } from "utils/getCard";

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
        id: id as string,
        userId: user!._id,
        message: value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room!.messages]);

  return (
    <section className="flex flex-col h-full border-2 border-border rounded-b-md md:rounded-md">
      <div className="py-4 px-5">
        <h3 className="font-bold">Chat</h3>
      </div>

      <div className="flex-col space-y-5 px-5 py-2 flex-1 overflow-y-scroll">
        {Array.isArray(room!.messages)
          ? room!.messages.map(({ image, message, username, cards }, i) => (
              <div
                key={i}
                ref={scrollRef}
                className={`${
                  user!.username === username ? "flex-row-reverse" : "flex-row"
                } flex items-start relative w-full gap-3 overflow-hidden`}
              >
                {image ? (
                  <div className="relative w-12 h-12 bg-primary rounded-full">
                    <UserImage image={image} className="scale-50" />
                  </div>
                ) : null}

                <div className="flex-1 min-h-20 px-3 pt-1 pb-3 rounded-lg border-borderWidth bg-purple1 border-border break-words">
                  <p className="font-medium text-lg">{username}</p>
                  <p>{message}</p>

                  <div className="flex space-x-1 mt-2">
                    {cards?.map(({ id }) => getCard(id))}
                  </div>
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
