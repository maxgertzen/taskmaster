import React from 'react';

import { CheckboxContainer, Label, StyledCheckbox } from './Checkbox.styled';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  onChange,
  checked = false,
  label = '',
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <CheckboxContainer>
      <StyledCheckbox
        data-testid='checkbox'
        type='checkbox'
        checked={checked}
        onChange={handleOnChange}
      />
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};
