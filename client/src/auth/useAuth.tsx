import { useAuth0 as realUseAuth0 } from '@auth0/auth0-react';

import { useAuth0 as mockUseAuth } from '../mocks';

const isMock = import.meta.env.VITE_IS_AUTH0_DISABLED === 'true';

export const useAuth = isMock ? mockUseAuth : realUseAuth0;
