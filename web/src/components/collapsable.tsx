import React, { useState } from "react";

export const CollapsableHead = ({
  children,
  styles,
}: {
  children: JSX.Element;
  styles: string;
}) => {
  return <summary className={styles}>{children}</summary>;
};

export const CollapsableBody = ({
  children,
  styles,
}: {
  children: JSX.Element;
  styles?: string;
}) => {
  return <div className={styles}>{children}</div>;
};

type CollapsableProps = {
  children: Array<
    | React.ReactElement<typeof CollapsableHead>
    | React.ReactElement<typeof CollapsableBody>
  >;
};

const Collapsable = ({ children }: CollapsableProps) => {
  const [open, setOpen] = useState(false);

  return (
    <details
      open={open}
      onClick={() => {
        setOpen(!open);
      }}>
      {children}
    </details>
  );
};

export default Collapsable;
