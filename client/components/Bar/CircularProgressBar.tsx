export const CircularProgressBar = ({ percentage }) => {
  const radius = 40;
  const strokeWidth = 10;
  const viewBoxSize = radius * 2 + strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference;
  const dashOffset = dashArray - (percentage / 100) * dashArray;

  return (
    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-[4.8rem] h-[4.8rem]">
      <circle
        r={radius}
        cx={50}
        cy={50}
        fill="transparent"
        strokeWidth={14}
        stroke="#181927"
      />
      <circle
        r={radius}
        cx={50}
        cy={50}
        fill="transparent"
        strokeWidth={10}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        stroke="#AB65ED"
      />
    </svg>
  );
};
