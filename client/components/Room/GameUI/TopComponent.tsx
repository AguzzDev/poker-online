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
    <section className="pt-6">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex justify-between w-full">
          <button className="flex items-center" onClick={() => leaveRoom()}>
            <IconXs Icon={MdChevronLeft} />
            <h2>Salir</h2>
          </button>

          <h2 className="text-2xl font-bold">
            {roomInfo || "Esperando Jugadores..."}
          </h2>

          <div className="flex space-x-5">
            <button onClick={() => toggleSound()}>
              <IconXs Icon={!sound ? FaVolumeOff : FaVolumeUp} />
            </button>
            <button onClick={() => setShowChat(!showChat)}>
              <IconXs Icon={showChat ? FaComments : FaCommentSlash} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
