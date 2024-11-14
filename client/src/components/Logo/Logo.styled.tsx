import styled from '@emotion/styled';

import { Title } from '../Title/Title';

export const LogoContainer = styled.div<{ withTitle?: boolean }>(
  ({ theme, withTitle = false }) => ({
    display: 'flex',
    alignItems: 'center',
    ...(withTitle ? {} : { justifyContent: 'center' }),
    svg: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1),
    },
    path: {
      fill: theme.colors.primary,
    },
  })
);

export const StyledTitle = styled(Title)<{
  size: 'small' | 'medium' | 'large';
}>(({ theme, size }) => ({
  fontSize:
    size === 'small'
      ? theme.typography.h6.fontSize
      : size === 'medium'
        ? theme.typography.h4.fontSize
        : theme.typography.h1.fontSize,
}));
