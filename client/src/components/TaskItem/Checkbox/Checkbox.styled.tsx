import styled from '@emotion/styled';

export const CheckboxContainer = styled.label({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
});

export const StyledCheckbox = styled.input<{ checked: boolean }>(
  ({ theme, checked }) => ({
    width: theme.spacing(2),
    height: theme.spacing(2),
    appearance: 'none',
    border: theme.borders.main(theme.colors.text),
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 150ms',
    cursor: 'pointer',
    color: theme.colors.text,
    '&::checked': {
      backgroundColor: theme.colors.primary,
    },
    '&::after': {
      content: checked ? `"✓"` : '""',
      fontSize: theme.spacing(1.5),
      color: theme.colors.text,
    },
    ':focus': {
      boxShadow: `0 0 0 1px ${theme.colors.primary}66`,
    },
    marginRight: theme.spacing(1.5),
  })
);

export const Label = styled.span(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: theme.typography.body.fontSize,
}));
