import * as Dialog from "@radix-ui/react-dialog";
import { ModalProps, PositionsEnum } from "models";

export const Modal = ({
  trigger,
  content,
  position = PositionsEnum.center,
  rounded,
}: ModalProps) => {
  let elementPosition =
    "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-auto";

  if (position === PositionsEnum.top) {
    elementPosition = "top-0 inset-0 h-2/4";
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[999] bg-black bg-opacity-20" />
        <Dialog.Content
          className={`fixed ${elementPosition} rounded-${rounded} z-[1000] bg-secondary`}
        >
          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
