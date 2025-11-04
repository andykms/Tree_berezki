import clsx from "clsx";

import styles from "./Button.module.scss";
import type ButtonProps from "./type";


export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { children, onClick, type, otherStyles } = props;
  return (
    <button onClick={onClick} className={clsx(styles[type], styles.button)} style={otherStyles}>
      {children}
    </button>
  );
};