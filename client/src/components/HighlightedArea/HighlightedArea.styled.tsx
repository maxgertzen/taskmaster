import styled from '@emotion/styled';

export const StyledHighlightedArea = styled('div')<{ isActive?: boolean }>(
  ({ isActive = false }) => ({
    position: 'relative',
    background: 'transparent',
    borderRadius: '50%',
    width: 'fit-content',
    ...(isActive ? { zIndex: 10000 } : { zIndex: 'unset' }),
    pointerEvents: isActive ? 'all' : 'auto',
  })
);
