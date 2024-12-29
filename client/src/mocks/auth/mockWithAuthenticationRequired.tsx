import { FC, ComponentProps, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth0 } from './mockUseAuth0';

interface WithAuthenticationRequiredOptions {
  returnTo?: string;
  onRedirecting?: () => JSX.Element;
}

export const mockWithAuthenticationRequired = <T extends object>(
  Component: FC<T>,
  options: WithAuthenticationRequiredOptions = {}
) => {
  const { returnTo = '/signin', onRedirecting = () => null } = options;

  return function WithAuthenticationRequired(
    props: ComponentProps<typeof Component>
  ) {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate(returnTo, {
          replace: true,
          state: { returnTo: window.location.pathname },
        });
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading || !isAuthenticated) {
      return onRedirecting?.();
    }

    return <Component {...props} />;
  };
};
