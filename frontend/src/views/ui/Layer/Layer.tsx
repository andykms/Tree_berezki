import type LayerProps from "./type";
import styles from "./Layer.module.scss";
import clsx from "clsx";

export const Layer: React.FC<LayerProps> = ({ children, type, otherStyles }) => {
  return (
    <div
      className={clsx(styles.layer, styles[type])}
      style={{
        ...otherStyles,
      }}
    >
      {children}
    </div>
  );
};