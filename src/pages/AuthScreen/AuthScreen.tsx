import React from 'react';
import cn from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/features/Auth/model/useAuth';
import { Loader } from 'src/shared/ui/Loader/Loader';
import styles from './AuthScreen.module.scss';
import SignIn, { SignInFields } from './SignIn/SignIn';
import SignOut from './SignOut/SignOut';
import SignUp, { SignUpFields } from './SignUp/SignUp';

export enum AuthAction {
  SignIn = 'signIn',
  SignUp = 'signUp',
  SignOut = 'signOut',
}

type AuthScreenProps = {
  authAction: AuthAction;
};

const AuthScreen: React.FC<AuthScreenProps> = ({ authAction }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { signIn, signUp, signOut, isLoading, error } = useAuth();

  const handleSignInSubmit = (data: SignInFields, e: React.BaseSyntheticEvent | undefined) => {
    e?.preventDefault();
    signIn(data.email, data.password);
    if (!error || error.length === 0) {
      navigate(-1);
    }
  };
  const handleSignUpSubmit = (data: SignUpFields, e: React.BaseSyntheticEvent | undefined) => {
    e?.preventDefault();
    signUp(data.email, data.password);
  };

  const handleSignOut = () => signOut();

  if (isLoading) {
    // return <div>{'loading'}</div>;
    return <Loader />;
  }

  const signInContent = (
    <>{authAction === AuthAction.SignIn && <SignIn onSubmit={handleSignInSubmit} />}</>
  );
  const signUpContent = (
    <>{authAction === AuthAction.SignUp && <SignUp onSubmit={handleSignUpSubmit} />}</>
  );
  const signOutContent = (
    <>{authAction === AuthAction.SignOut && <SignOut onSignOut={handleSignOut} />}</>
  );

  return (
    <div className={cn(styles.page)}>
      <div>
        {signInContent}
        {signUpContent}
        {signOutContent}
      </div>
      {error && (
        <div className={styles.error}>{(error as string[]).map((str) => t(str)).join('\n')}</div>
      )}
    </div>
  );
};

export default AuthScreen;
