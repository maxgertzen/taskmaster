import { useContext } from 'react';

import { MockContext } from './MockContext';

export const useAuth0 = () => useContext(MockContext);
