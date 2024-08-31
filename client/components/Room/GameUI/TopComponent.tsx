import React, { useEffect, useState } from "react";
import { IconSm } from "components/Icon";
import { FaComments, FaCommentSlash } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import { useGame } from "context/Game/GameProvider";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";
import { ChatModal } from "components/Modal/ChatModal";
import { ShowChatProps } from "models";

export const TopComponent = ({ showChat, setShowChat }: ShowChatProps) => {
  const { leaveRoom, roomStatus } = useGame();

  const [sound, setSound] = useState(false);
  const [music] = useState(new Audio("/sounds/music1.mp3"));

  useEffect(() => {
    music.volume = 0.1;

    return () => {
      music.pause();
    };
  }, [music]);

  const playMusic = () => {
    setSound(true);
    music.play();
  };

  const pauseMusic = () => {
    setSound(false);
    music.pause();
  };

  const toggleSound = () => {
    if (music.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  };

  return (
    <div className="flex items-center justify-between mx-auto mb-3">
      <div className="flex justify-between w-full">
        <button className="flex items-center" onClick={() => leaveRoom()}>
          <IconSm Icon={MdChevronLeft} />
          <h4 className="hidden md:block">Salir</h4>
        </button>

        <h3 className="font-bold">{roomStatus || "Waiting players..."}</h3>

        <div className="flex space-x-2 md:space-x-5 items-center">
          <button onClick={() => toggleSound()}>
            <IconSm Icon={!sound ? SpeakerXMarkIcon : SpeakerWaveIcon} />
          </button>
          <button
            className="hidden lg:flex"
            onClick={() => setShowChat(!showChat)}
          >
            <IconSm Icon={showChat ? FaComments : FaCommentSlash} />
          </button>
          <div className="flex lg:hidden">
            <ChatModal showChat={showChat} setShowChat={setShowChat} />
          </div>
        </div>
      </div>
    </div>
  );
};
