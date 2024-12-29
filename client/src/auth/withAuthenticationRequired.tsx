import { withAuthenticationRequired as realWithAuthenticationRequired } from '@auth0/auth0-react';

import { mockWithAuthenticationRequired } from '../mocks';

const isMock = import.meta.env.VITE_IS_AUTH0_DISABLED === 'true';

export const withAuthenticationRequired = isMock
  ? mockWithAuthenticationRequired
  : realWithAuthenticationRequired;
