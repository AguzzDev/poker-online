import { ContainerProps, ContainerTypeEnum } from "models";

export const Container = ({
  style = "",
  type = ContainerTypeEnum.default,
  children,
}: ContainerProps) => {
  let body = <></>;

  body = (
    <section className={`${style} bg-secondary p-2 md:p-5 rounded-md overflow-hidden`}>
      {children}
    </section>
  );

  return body;
};
