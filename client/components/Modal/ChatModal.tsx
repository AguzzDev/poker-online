import { IconXs } from "components/Icon";
import { Modal } from "./Modal";
import { FaComments, FaCommentSlash } from "react-icons/fa";
import { PositionsEnum } from "models";
import { Chat } from "components/Room";

export const ChatModal = ({ showChat, setShowChat }: any) => {
  return (
    <Modal
      position={PositionsEnum.top}
      trigger={
        <button onClick={() => setShowChat(!showChat)}>
          <IconXs Icon={showChat ? FaComments : FaCommentSlash} />
        </button>
      }
      content={<Chat />}
    />
  );
};
