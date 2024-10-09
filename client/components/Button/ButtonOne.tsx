import { RFCButtonProps } from "models";

export const ButtonOne: React.FC<RFCButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button {...props} className={`${className} bg-primary hover:opacity-90 px-10 py-2 md:py-4 rounded-md text-base md:text-lg lg:text-xl`}>
      {children}
    </button>
  );
};
