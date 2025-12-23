import React from 'react';

type BdiProps = React.HTMLAttributes<HTMLElement>;

export const Bdi: React.FC<BdiProps> = ({ children, ...props }) => (
  <bdi {...props}>{children}</bdi>
);
