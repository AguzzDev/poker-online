import * as React from "react";
const ChipsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    fill="none"
    {...props}
  >
    <circle cx={11} cy={11.53} r={10} stroke="#fff" strokeWidth={2} />
    <path
      stroke="#fff"
      strokeWidth={2}
      d="M17.174 11.53c0 3.29-2.74 6-6.174 6-3.433 0-6.174-2.71-6.174-6 0-3.291 2.741-6 6.174-6 3.433 0 6.174 2.709 6.174 6Z"
    />
  </svg>
);
export default ChipsIcon;
