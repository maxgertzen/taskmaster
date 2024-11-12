import styled from '@emotion/styled';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

export const HeaderContainer = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
}));

export const LogoContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  svg: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  path: {
    fill: theme.colors.primary,
  },
}));

export const Title = styled.h1(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.h1.fontWeight,
  color: theme.colors.text,
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
