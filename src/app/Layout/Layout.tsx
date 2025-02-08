import { FC } from 'react';
import cn from 'clsx';
import { Outlet } from 'react-router-dom';
import style from './Layout.module.scss';
import CartIndicator from '../../features/Cart/ui/CartIndicator/CartIndicator';
import Header from '../../shared/ui/Header/Header';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher/LanguageSwitcher';
import Logo from '../../shared/ui/Logo/Logo';
import NavigationBar, { NavItem } from '../../shared/ui/NavigationBar/NavigationBar';
import ThemeSwitcher from '../../shared/ui/ThemeSwitcher/ThemeSwitcher';

type LayoutProps = {
  menuItems: NavItem[];
};

const Layout: FC<LayoutProps> = ({ menuItems }) => {
  return (
    <div className={cn(style.layout)}>
      <Header>
        <div className={style.item}>
          <Logo to="/" />
        </div>
        <div className={style.item}>
          <NavigationBar menuItems={menuItems} />
        </div>
        <div className={style.rightWrapper}>
          <div className={style.item}>
            <CartIndicator />
          </div>
          <div className={style.item}>
            <ThemeSwitcher />
          </div>
          <div className={style.item}>
            <LanguageSwitcher />
          </div>
        </div>
      </Header>
      <div className={style.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
