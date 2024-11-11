import { FC, useState } from 'react';

import { StyledListInput } from './ListInput.styled';

interface ListInputProps {
  initialName?: string;
  placeholder: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export const ListInput: FC<ListInputProps> = ({
  initialName = '',
  placeholder,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    } else {
      onCancel();
    }
    setName('');
  };

  return (
    <StyledListInput
      value={name}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      placeholder={placeholder}
      autoFocus
    />
  );
};
