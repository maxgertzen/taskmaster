import { Auth0Provider } from '@auth0/auth0-react';
import React, { ReactNode } from 'react';

import { MockAuth0Provider } from '../mocks';

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const Provider = isMock ? MockAuth0Provider : Auth0Provider;

  return (
    <Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Provider>
  );
};

export default AuthProvider;
