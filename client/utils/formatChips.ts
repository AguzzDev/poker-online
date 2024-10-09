export const formatChips = (num: number | string) => {
  const numberFormat = Number(num);

  if (numberFormat >= 1000000) {
    return `${(numberFormat / 1000000).toLocaleString()}M`;
  } else if (numberFormat >= 1000) {
    return `${(numberFormat / 1000).toLocaleString()}k`;
  }
  return numberFormat.toString();
};
