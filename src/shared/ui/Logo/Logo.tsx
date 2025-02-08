import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Logo.module.scss';

type LogoProps = {
  to?: string;
};

const Logo: React.FC<LogoProps> = ({ to }) => {
  const navigate = useNavigate();
  const handlerOnClick = () => (to ? navigate(to, { replace: true }) : null);
  return (
    <div className={style.wrapper} onClick={handlerOnClick}>
      <div className={style.caption}>
        <span style={{ cursor: 'pointer' }}>Logo</span>
      </div>
    </div>
  );
};

export default Logo;
