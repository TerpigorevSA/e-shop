import React, { ReactNode } from 'react';
import style from './Header.module.scss';

type HeaderProps = {
  children: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return <div className={style.header}>{children}</div>;
};

export default Header;
