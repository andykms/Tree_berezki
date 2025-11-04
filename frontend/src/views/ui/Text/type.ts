import type { DetailedHTMLProps, HTMLAttributes } from "react";

type TTextTypes = "main" | "header" | "description" | "primary";

type TFontTypes = "small" | "small2" | "main" | "main2" | "big" | "big2";

type TFontFamilyTypes = "serif" | "sansSerif";

export default interface TextProps {
  text: string;
  otherStyles?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
  type: TTextTypes;
  size: TFontTypes;
  family: TFontFamilyTypes;
}

