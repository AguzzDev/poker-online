import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RadixComponentProps } from "models";

export const Dropdown = ({ trigger, content }: RadixComponentProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger className="outline-none">{trigger}</DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={5}
        className={`px-3 py-2 rounded-md border-border border-borderWidth z-[1000] bg-secondary`}
      >
        <DropdownMenu.Arrow className="text-border fill-current" />

        {content.map((data) => (
          <DropdownMenu.Item className="outline-none">{data}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
