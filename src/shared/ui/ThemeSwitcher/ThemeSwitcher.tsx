import { FC } from 'react';
import style from './ThemeSwitcher.module.scss';
import darkIco from '../../assets/dark_mode_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import lightIco from '../../assets/light_mode_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import useTheme, { lightTheme } from '../../contexts/ThemeContext/ThemeContext';

const ThemeSwitcher: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={style.wrapper}>
      <button className={style.button} onClick={() => toggleTheme()}>
        <img src={theme === lightTheme ? darkIco : lightIco} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
