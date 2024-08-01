import { RFCButtonProps } from "models";

export const ButtonOne: React.FC<RFCButtonProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <button {...props} className={`bg-primary hover:opacity-90 px-10 py-2 md:py-4 rounded-md w-full ${style} text-xl`}>
      {children}
    </button>
  );
};
