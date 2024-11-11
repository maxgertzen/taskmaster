import styled from '@emotion/styled';

export const AddTaskInputContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  svg: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
}));

export const Input = styled.input(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  border: theme.borders.main(),
  borderRadius: theme.borders.radius,
  fontSize: theme.typography.body.fontSize,
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
}));
