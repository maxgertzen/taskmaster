import styled from '@emotion/styled';

export const StyledResizableHandle = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: theme.spacing(0.5),
  height: '100%',
  cursor: 'col-resize',
  backgroundColor: 'transparent',
}));
