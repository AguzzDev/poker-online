import { ContainerProps, ContainerTypeEnum } from "models";

export const Container = ({
  style,
  type = ContainerTypeEnum.default,
  children,
}: ContainerProps) => {
  let body = <></>;

  if (type === ContainerTypeEnum.bordersWhite) {
    body = <></>;
  } else {
    body = (
      <section
        className={`${style} h-full bg-secondary p-2 md:p-5 rounded-md overflow-hidden`}
      >
        {children}
      </section>
    );
  }

  return body;
};
