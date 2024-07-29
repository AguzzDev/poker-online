import React, { useEffect, useState } from "react";

import { IconXs } from "components/Icon";
import {
  FaVolumeOff,
  FaVolumeUp,
  FaComments,
  FaCommentSlash,
} from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import { useGame } from "context/Game/GameProvider";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";
import { ChatModal } from "components/Modal/ChatModal";

export const TopComponent = ({ showChat, setShowChat }) => {
  const { leaveRoom, roomInfo } = useGame();

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
    <div className="flex items-center justify-between mx-auto">
      <div className="flex justify-between w-full">
        <button className="flex items-center" onClick={() => leaveRoom()}>
          <IconXs Icon={MdChevronLeft} />
          <p className="hidden md:block">Salir</p>
        </button>

        <h4 className="font-bold">{roomInfo || "Esperando Jugadores..."}</h4>

        <div className="flex space-x-2 md:space-x-5 items-center">
          <button onClick={() => toggleSound()}>
            <IconXs Icon={!sound ? SpeakerXMarkIcon : SpeakerWaveIcon} />
          </button>
          <button
            className="hidden md:block"
            onClick={() => setShowChat(!showChat)}
          >
            <IconXs Icon={showChat ? FaComments : FaCommentSlash} />
          </button>
          <div className="block md:hidden">
            <ChatModal showChat={showChat} setShowChat={setShowChat} />
          </div>
        </div>
      </div>
    </div>
  );
};
