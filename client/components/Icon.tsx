export const IconMd = ({ Icon, color, props }: any) => {
  return <Icon className={`${color} ${props} w-12 h-12 md:h-14 md:w-14`} />;
};
export const IconSm = ({ Icon, color, props }: any) => {
  return <Icon className={`${color} ${props} w-6 h-6 md:h-8 md:w-8`} />;
};
export const IconXs = ({ Icon, color, props }: any) => {
  return <Icon className={`${color} ${props} h-5 w-5`} />;
};
