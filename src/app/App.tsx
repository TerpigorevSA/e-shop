import React, { useEffect } from 'react';
import cn from 'clsx';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AuthScreen, { AuthAction } from 'src/pages/AuthScreen/AuthScreen';
import styles from './App.module.scss';
import Layout from './Layout/Layout';
import './localization';
import menuItems from './menu/menuItems';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { NavigationProvider } from './providers/NavigationProvider';
import { setupAuthSync } from './services/setupAuthSync';
import { AppDispatch } from './store/store';
import { setAuthenticated } from '../features/Auth/model/slice';
import { ROUTES } from '../shared/configs/routes';
import { WithAuthenticationState } from '../shared/hocs/withAuthenticationState';
import { getAccessToken } from '../shared/lib/localStorage';
import { LanguageProvider } from '../shared/providers/LanguageProvider/LanguageProvider';
import ThemeProvider from '../shared/providers/ThemeProvider/ThemeProvider';
// import { getProfile } from '../entities/User/model/thunks';

const App = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (getAccessToken()) {
      // dispatch(getProfile());
      const token = getAccessToken();
      dispatch(setAuthenticated({ token }));
    }
    setupAuthSync();
  }, []);

  const generateRoutes = (items: typeof menuItems, rootRoute: string, signInRoute: string) => {
    return [
      ...items.map((item) => {
        if (item.dropdown) {
          return (
            <React.Fragment key={item.path + item.label}>
              <Route
                path={item.path ?? undefined}
                element={
                  <WithAuthenticationState
                    authenticationState={item.authenticationState}
                    routes={{ root: rootRoute, signIn: signInRoute }}
                  >
                    {item.element}
                  </WithAuthenticationState>
                }
              />
              {generateRoutes(item.dropdown, rootRoute, signInRoute)}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={item.path + item.label}>
            <Route
              path={item.path ?? undefined}
              element={
                <WithAuthenticationState
                  authenticationState={item.authenticationState}
                  routes={{ root: rootRoute, signIn: signInRoute }}
                >
                  {item.element}
                </WithAuthenticationState>
              }
            />
          </React.Fragment>
        );
      }),
    ];
  };
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationProvider>
          <ErrorBoundary>
            <div className={cn(styles.app)}>
              <Routes>
                <Route path="/" element={<Layout menuItems={menuItems} />}>
                  {generateRoutes(menuItems, ROUTES.ROOT, ROUTES.SIGNIN)}
                  <Route
                    path={ROUTES.AUTHENTICATED_SIGNIN}
                    element={<AuthScreen authAction={AuthAction.SignIn} />}
                  />
                </Route>
              </Routes>
            </div>
          </ErrorBoundary>
        </NavigationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
