import React from 'react';

import { CheckboxContainer, Label, StyledCheckbox } from './Checkbox.styled';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label = '',
}) => {
  return (
    <CheckboxContainer>
      <StyledCheckbox type='checkbox' checked={checked} onChange={onChange} />
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};
