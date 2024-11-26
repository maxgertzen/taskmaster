import { withAuthenticationRequired as realWithAuthenticationRequired } from '@auth0/auth0-react';

import { mockWithAuthenticationRequired } from '../mocks';

const isMock = import.meta.env.VITE_USE_MOCK === 'true';

export const withAuthenticationRequired = isMock
  ? mockWithAuthenticationRequired
  : realWithAuthenticationRequired;
