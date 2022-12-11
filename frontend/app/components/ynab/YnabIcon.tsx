import React from "react";
import classnames from "classnames";
import type { PropsWithClassName } from "../primitive/PropsWithClassName";

export function YnabIcon({ className }: PropsWithClassName) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={classnames("h-8 w-8", className)}
    >
      <path
        d="M31.57 34.75s-3.83-2.24-2.47-5.42a26 26 0 0 1 2.76-4s2.47 2.52 2.9 4c0 0 1.3 3.18-2.15 5.42l-.7-4.2zm15.3 8.3s3.6 0 3.94 2.8a22 22 0 0 1-.31 3.93 11.81 11.81 0 0 1-3.66-1.64 3.64 3.64 0 0 1-.69-4.67l2.2 2.66zm-28.87.3s1.52 3.5-1 5a23.09 23.09 0 0 1-4 1.39s-.44-3 0-4.25a3.85 3.85 0 0 1 4.23-2.66l-1.58 3.27zm36.15-12.42s1.9-4 5.2-2.93a26.26 26.26 0 0 1 4.24 2.4s-2.3 2.7-3.76 3.23c0 0-3 1.58-5.58-1.68l4.13-1.05zm-44.33.8s-2.5 3.66-5.58 2.1a26.64 26.64 0 0 1-3.82-3s2.7-2.3 4.2-2.62c0 0 3.26-1.08 5.26 2.52l-4.25.4zM24 15.14s-4.95-.73-4.82-4.6a29 29 0 0 1 1.26-5.3S24 6.82 25.1 8.2c0 0 2.68 2.75-.05 6.5l-2.46-4.06zm-8.85 2.1s-4.7.23-5.3-3.35a28.35 28.35 0 0 1 .19-5.14s3.66.8 4.88 1.88c0 0 3 2.05 1.14 6l-3-3.3zm24.48-2.43s-3.15-3.9-.45-6.64A29.85 29.85 0 0 1 43.7 5.1s1.6 3.63 1.46 5.36c0 0 .1 3.83-4.44 4.76l.94-4.66zm-8.1-2.9s-4.92-2.82-3.2-6.83A33.43 33.43 0 0 1 31.84 0S35 3.17 35.58 5.06c0 0 1.7 4-2.74 6.84l-.92-5.3zm16.7 4.54s-2-4.07.94-6a26.23 26.23 0 0 1 4.61-1.74s.7 3.53.2 5c0 0-.67 3.4-4.88 3.3l1.77-3.92zm-16.65 6.9s-3.83-2.24-2.47-5.42a26.41 26.41 0 0 1 2.76-4s2.47 2.52 2.9 4c0 0 1.3 3.18-2.15 5.42l-.7-4.2zM24.55 27s-5.88.24-6.64-4.27a34.71 34.71 0 0 1 .21-6.46s4.56 1.05 6.1 2.4c0 0 3.73 2.6 1.48 7.6l-3.8-4.17zM13.8 25.43S8.66 28.3 6 24.6a34.63 34.63 0 0 1-2.73-5.86s4.55-1.12 6.54-.6c0 0 4.5.65 4.73 6.1l-5.27-2zm24.53.95S36 21 39.9 18.64a35.43 35.43 0 0 1 6.1-2.16s.7 4.63 0 6.56c0 0-1.08 4.43-6.53 4.14L42 22.13zm10.97-2.33s.45-5.86 5-6.1a34.68 34.68 0 0 1 6.39.95s-1.57 4.4-3.1 5.78c0 0-3 3.4-7.7.6L54.5 22zm-.2 13.82s3.83-4.47 7.65-1.95a35.29 35.29 0 0 1 4.59 4.55s-3.88 2.63-5.93 2.82c0 0-4.45 1-6.56-4.08l5.65.08zm-34.2 1.37s-2.23 5.45-6.65 4.26a34.93 34.93 0 0 1-5.78-2.87s2.85-3.72 4.73-4.55c0 0 3.93-2.3 7.5 1.8l-5.4 1.7z"
        fill="#71c0e5"
      />
      <path d="M31.83 29.17" fill="#070707" />
      <path
        d="M39.68 29.6H51.8L37.63 50.83V64h-11.2V50.76L12.35 29.6h12.4L31.92 42z"
        fill="#71c0e5"
      />
    </svg>
  );
}
