export const options = [
  { label: "10k", value: "10000" },
  { label: "50k", value: "50000" },
  { label: "100k", value: "100000" },
  { label: "500k", value: "500000" },
  { label: "1M", value: "1000000" },
];

export const formatBuyIn = (arg: number) => {
  return options.find((el) => el.value === arg.toString())!.label;
};
