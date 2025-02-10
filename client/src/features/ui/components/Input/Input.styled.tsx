import styled from '@emotion/styled';

export const StyledInputContainer = styled.div<{ isSearch: boolean }>(
  ({ theme, isSearch }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flex: 14,
    flexShrink: 0,
    flexBasis: '50%',
    gap: theme.spacing(1),
    ...(isSearch ? { marginRight: theme.spacing(1) } : {}),
    svg: {
      cursor: 'pointer',
    },
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      flex: 1,
      gap: theme.spacing(0.5),
      justifyContent: 'flex-end',
      marginRight: 0,
      alignItems: 'end',
    },
  })
);

export const StyledInput = styled.input<{ isSearch: boolean }>(
  ({ theme, isSearch }) => ({
    width: '100%',
    padding: theme.spacing(isSearch ? 1 : 2),
    border: theme.borders.main(),
    borderRadius: theme.borders.radius,
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  })
);
