import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DropdownProps } from "models";

export const Dropdown = ({ trigger, content, size = "max" }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="outline-none">
        <div className="flex space-x-5 border-2 border-accent bg-border rounded-md py-1 px-2 sm:px-5 sm:py-2">
          {trigger}
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className={`w-${size} flex flex-col justify-end items-end px-5 border-2 border-accent bg-border rounded-md z-[1000]`}
        >
          <DropdownMenu.Arrow
            width={20}
            height={10}
            className="text-border fill-current"
          />

          {Array.isArray(content) &&
            content.map((data, index) => (
              <DropdownMenu.Item
                key={index}
                className="py-2 outline-none font-bold"
              >
                {data}
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
