import { RFCButtonProps } from "models";

export const ButtonOne: React.FC<RFCButtonProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <button {...props} className={`bg-primary hover:opacity-90 px-5 py-1 rounded-md w-full ${style}`}>
      {children}
    </button>
  );
};
