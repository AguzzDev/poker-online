import { RFCButtonProps } from "models";

export const ButtonOne: React.FC<RFCButtonProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <button {...props} className={`bg-accent px-5 py-1 rounded-md ${style}`}>
      {children}
    </button>
  );
};
