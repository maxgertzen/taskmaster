import styled from '@emotion/styled';

export const StyledIconWrapper = styled.div<{
  size: number;
  isVisible: boolean;
  applyInvert?: boolean;
  isClickable?: boolean;
}>(
  ({
    theme,
    size,
    applyInvert = false,
    isVisible = true,
    isClickable = true,
  }) => ({
    display: 'flex',
    width: theme.spacing(size),
    height: theme.spacing(size),
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isClickable ? 'pointer' : 'default',
    opacity: isVisible ? 1 : 0.5,
    svg: {
      filter: applyInvert ? 'invert(1)' : '',
    },
    ':hover': {
      opacity: 0.9,
    },
  })
);
