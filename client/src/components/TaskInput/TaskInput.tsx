import { useEffect, useMemo, useState } from 'react';

import { debounce } from '../../utils/debounce';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { StyledTaskInputContainer, StyledInput } from './TaskInput.styled';

interface TaskInputProps {
  isSearch?: boolean;
  onSubmit: (text: string) => void;
  value?: string;
  onReset?: () => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onSubmit,
  isSearch = false,
  value = '',
  onReset,
}) => {
  const [text, setText] = useState<string>(value);

  const debouncedOnSubmit = useMemo(
    () =>
      debounce((text: string) => {
        onSubmit(text);
      }, 300),
    [onSubmit]
  );

  const handleOnSubmit = () => {
    if (!text) return;

    if (isSearch) {
      debouncedOnSubmit(text);
    } else {
      onSubmit(text);
      setText('');
    }

    if (onReset) {
      onReset();
    }
  };

  const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter' && text) {
      handleOnSubmit();
    }
  };

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setText(value);

    if (isSearch) {
      debouncedOnSubmit(value);
    }
  };

  useEffect(() => {
    return () => {
      if (isSearch) {
        debouncedOnSubmit.cancel();
      }
    };
  }, [debouncedOnSubmit, isSearch]);

  useEffect(() => {
    if (isSearch && value) {
      setText(value);
    }
  }, [isSearch, value]);

  return (
    <StyledTaskInputContainer isSearch={isSearch}>
      <StyledInput
        type='text'
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={isSearch ? 'Search tasks' : 'Add a task'}
        isSearch={isSearch}
      />
      <FaIcon
        icon={['fas', isSearch ? 'magnifying-glass' : 'plus']}
        size={isSearch ? '1x' : '2x'}
        onClick={handleOnSubmit}
      />
    </StyledTaskInputContainer>
  );
};
