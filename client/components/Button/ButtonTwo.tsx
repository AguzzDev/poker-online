import { RFCButtonProps } from "models";

export const ButtonTwo: React.FC<RFCButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${className} bg-purple1 px-5 py-1 rounded-md`}
    >
      {children}
    </button>
  );
};
