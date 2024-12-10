import styled from '@emotion/styled';

export const StyledIconWrapper = styled.div<{
  size: number;
  isVisible: boolean;
  applyInvert?: boolean;
}>(({ theme, size, applyInvert = false, isVisible = true }) => ({
  display: 'flex',
  width: theme.spacing(size),
  height: theme.spacing(size),
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  opacity: isVisible ? 1 : 0.5,
  svg: {
    filter: applyInvert ? 'invert(1)' : undefined,
  },
}));
