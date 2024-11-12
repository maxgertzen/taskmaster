import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FaIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  cursor: 'pointer',
  '&:hover': {
    filter: 'invert(0.5)',
  },
  visibility: isActive ? 'hidden' : 'visible',
  transition: 'filter 150ms',
}));
