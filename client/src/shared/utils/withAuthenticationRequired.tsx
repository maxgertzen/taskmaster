import { withAuthenticationRequired as realWithAuthenticationRequired } from '@auth0/auth0-react';

import { IS_AUTH0_DISABLED } from '@/constants';
import { mockWithAuthenticationRequired } from '@/mocks';

const isMock = IS_AUTH0_DISABLED === 'true';

export const withAuthenticationRequired = isMock
  ? mockWithAuthenticationRequired
  : realWithAuthenticationRequired;
