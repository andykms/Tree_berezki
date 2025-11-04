import styles from "./Text.module.scss";
import type TextProps from "./type";
import clsx from "clsx";

export const Text: React.FC<TextProps> = (props: TextProps) => {
  const { text, otherStyles, type, size, family } = props;

  return (
    <span className={clsx(styles[size], styles[type], styles[family])} style={otherStyles}>
      {text}
    </span>
  );
};
