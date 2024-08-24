import * as React from "react";

const DiamondsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="fill-current"
    viewBox="0 0 4 4"
    {...props}
  >
    <path fillRule="evenodd" d="m0 2.16 2 2 2-2-2-2-2 2Z" clipRule="evenodd" />
  </svg>
);
export default DiamondsIcon;
