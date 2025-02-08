import React from 'react';
import cn from 'clsx';
import styles from './RootScreen.module.scss';

const RootScreen: React.FC = () => {
  return (
    <>
      <p>Учебный проект заготовки под магазин.</p>
      <p>В проекте используются:</p>
      <ul className={cn(styles.centeredList)}>
        <li>
          <span>React</span>
        </li>
        <li>
          <span>React Router Dom</span>
        </li>
        <li>
          <span>Redux</span>
        </li>
        <li>
          <span>RTK Query</span>
        </li>
        <li>
          <span>React Hook Form</span>
        </li>
        <li>
          <span>Чистые формы для фильров</span>
        </li>
        <li>
          <span>Yup</span>
        </li>
        <li>
          <span>i18next</span>
        </li>
      </ul>
      <p>Есть два (минимум) зарегистрированных ползователя.</p>
      <div className={cn(styles.tab)}>
        <span className={cn(styles.tabItem)}>user68@example.com</span>
        <span className={cn(styles.tabItem)}>qqqqqqqq</span>
      </div>
      <div className={cn(styles.tab)}>
        <span className={cn(styles.tabItem)}>qwerty@qwerty.com</span>
        <span className={cn(styles.tabItem)}>qqqqqqqq</span>
      </div>
    </>
  );
};

export default RootScreen;
