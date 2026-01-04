import type { DetailedHTMLProps, HTMLAttributes } from "react";

type TButtonTypes = "primary" | "secondary" | "tertiary" | "transparent" | "semiTransparent";

export default interface ButtonProps {
  children: React.ReactNode;
  otherStyles?: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
  onClick?: () => void;
  type: TButtonTypes;
}