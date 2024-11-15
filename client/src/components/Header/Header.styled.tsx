import styled from '@emotion/styled';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

export const HeaderContainer = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
}));

export const UserActionsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  span: {
    marginRight: theme.spacing(1),
  },
}));

export const DarkModeIcon = styled(FaIcon)(({ theme }) => ({
  fill: theme.colors.text,
}));

export const VerticalDivider = styled.div(({ theme }) => ({
  width: '1px',
  height: '24px',
  backgroundColor: theme.colors.text,
  margin: theme.spacing(0, 2),
}));
