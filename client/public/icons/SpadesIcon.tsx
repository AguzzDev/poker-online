import * as React from "react";
const SpadesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="fill-current"
    viewBox="0 0 4 4"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M2.94 3.295c.773.009 1.25-.475.988-.984s-.523-.623-.934-.992C2.583.949 1.984.31 1.988.16c.003.15-.57.789-.982 1.158-.41.369-.672.483-.934.992-.261.51.215.993.988.984.531-.006.77-.303.868-.49v.244s-.17.879-1.366.975H.37v.137h3.258v-.137h-.19c-1.197-.096-1.367-.975-1.367-.975v-.211c.115.186.366.452.868.457Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SpadesIcon;
