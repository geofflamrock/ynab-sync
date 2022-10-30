import classnames from "classnames";
import React from "react";
import type { PropsWithClassName } from "../primitive/PropsWithClassName";

export function WestpacLogo({ className }: PropsWithClassName) {
  return (
    <svg
      x="0px"
      y="0px"
      className={classnames("w-8 h-8", className)}
      viewBox="0 0 325.7 132.8"
      enableBackground="new 0 0 325.7 132.8"
    >
      <g>
        <path
          fill="#D5002B"
          d="M115.4,118.7l-32-99.3C78.9,4.2,71.2,0,59.5,0H0c4.7,1.9,7.8,14,7.8,14
		l28.7,99.7c3.3,12.5,13.7,19.1,25.4,19.1h63C120.3,132,115.4,118.7,115.4,118.7"
        />
        <path
          fill="#D5002B"
          d="M210.3,118.7l32-99.3C246.8,4.2,254.5,0,266.2,0h59.5c-4.7,1.9-7.8,14-7.8,14
		l-28.7,99.7c-3.3,12.5-13.7,19.1-25.4,19.1h-63C205.4,132,210.3,118.7,210.3,118.7"
        />
        <rect x="128" y="0.8" fill="#D5002B" width="70" height="132" />
      </g>
    </svg>
  );
}
