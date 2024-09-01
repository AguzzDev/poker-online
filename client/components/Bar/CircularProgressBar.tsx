import { useState, useLayoutEffect } from "react";

export const CircularProgressBar = ({ turn }: { turn: boolean }) => {
  const [percentage, setPercentage] = useState(0);

  useLayoutEffect(() => {
    if (!turn) return;

    let timer = 100;
    const interval = setInterval(() => {
      timer -= 1;
      setPercentage(timer);

      if (timer <= 0) {
        clearInterval(interval);
        setPercentage(0);
      }
    }, 100);
  }, [turn]);

  const radius = 40;
  const strokeWidth = 10;
  const viewBoxSize = radius * 2 + strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference;
  const dashOffset = dashArray - (percentage / 100) * dashArray;

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className="w-full h-full"
    >
      <circle
        r={radius}
        cx={50}
        cy={50}
        fill="transparent"
        strokeWidth={12}
        stroke="#181927"
      />
      <circle
        r={radius}
        cx={50}
        cy={50}
        fill="transparent"
        strokeWidth={8}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        stroke="#CC8DEF"
      />
    </svg>
  );
};
