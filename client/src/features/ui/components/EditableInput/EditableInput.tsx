import { FC, useState } from 'react';

import { StyledEditableInput } from './EditableInput.styled';

interface EditableInputProps {
  initialText?: string;
  placeholder: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export const EditableInput: FC<EditableInputProps> = ({
  initialText = '',
  placeholder,
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState(initialText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
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
    if (text.trim()) {
      onSubmit(text.trim());
    } else {
      onCancel();
    }
    setText('');
  };

  return (
    <StyledEditableInput
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
      placeholder={placeholder}
      autoFocus
    />
  );
};
