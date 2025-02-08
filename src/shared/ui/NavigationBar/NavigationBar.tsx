import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import style from './NavigationBar.module.scss';
import withAuthenticationState, { AuthenticationState } from '../../hocs/withAuthenticationState';

export interface NavItem {
  label: string;
  path?: string | null;
  element?: React.ReactNode | null;
  authenticationState?: AuthenticationState;
  dropdown?: NavItem[];
}

interface NavigationBarProps {
  menuItems: NavItem[];
}

const NavigationBar: React.FC<NavigationBarProps> = ({ menuItems }) => {
  const { t } = useTranslation();
  const AuthNavLink = withAuthenticationState(NavLink);
  return (
    <nav className={style.navbar}>
      {menuItems.map((item) => (
        <div key={item.label} className={style.navItem}>
          <AuthNavLink
            to={item.path ?? ''}
            authenticationState={item.authenticationState}
            className={style.link}
          >
            {t(item.label)}
          </AuthNavLink>
          {item.dropdown && (
            <div className={style.dropdown}>
              {item.dropdown.map((subItem) => (
                <AuthNavLink
                  key={subItem.label}
                  to={subItem.path ?? ''}
                  authenticationState={subItem.authenticationState}
                  className={style.link}
                >
                  {t(subItem.label)}
                </AuthNavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavigationBar;
