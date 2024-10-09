export const formatChips = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString()}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toLocaleString()}k`;
  }
  return num.toString();
};
