import * as Dialog from "@radix-ui/react-dialog";
import { ModalProps } from "models";

export const Modal = ({ button, content }: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20" />
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            margin: "auto",
          }}
        >
          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
