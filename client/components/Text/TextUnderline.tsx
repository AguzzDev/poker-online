export const TextUnderline = ({ text }: { text: string }) => {
  return (
    <div className="w-max">
      <h3>{text}</h3>

      <div className="h-[.2em] bg-purple1 w-3/4"></div>
    </div>
  );
};
