import styled from '@emotion/styled';

export const LogoContainer = styled('div')<{ withTitle?: boolean }>(
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
      fill: theme.colors.primary.main,
    },
  })
);

export const StyledTitle = styled('h1')<{
  size: 'small' | 'medium' | 'large';
}>(({ theme, size }) => ({
  fontSize:
    size === 'small'
      ? theme.typography.h6.fontSize
      : size === 'medium'
        ? theme.typography.h4.fontSize
        : theme.typography.h1.fontSize,
  [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
    display: 'none',
  },
}));

export const TaskMasterLogoComponent = styled.img(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(10),
}));
