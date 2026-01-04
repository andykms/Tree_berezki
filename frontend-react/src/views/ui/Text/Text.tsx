import clsx from "clsx";

import styles from "./Text.module.scss";
import type TextProps from "./type";


export const Text: React.FC<TextProps> = (props: TextProps) => {
  const { text, otherStyles, type, size, family } = props;

  return (
    <span className={clsx(styles[size], styles[type], styles[family])} style={otherStyles}>
      {text}
    </span>
  );
};
