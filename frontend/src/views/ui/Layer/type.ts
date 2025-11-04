import type { DetailedHTMLProps, HTMLAttributes } from "react";

type TLayerTypes = "base" | "transparent" | "semiTransparent";

export default interface LayerProps {
  children: React.ReactNode;
  type: TLayerTypes;
  otherStyles?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

