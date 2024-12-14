import { useEffect, useMemo, useState } from 'react';

import { debounce } from '../../utils/debounce';
import { HighlightedArea } from '../HighlightedArea/HighlightedArea';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

import { StyledTaskInputContainer, StyledInput } from './TaskInput.styled';

interface TaskInputProps {
  isSearch?: boolean;
  onSubmit: (text: string) => void;
  value?: string;
  onReset?: () => void;
  withToggle?: boolean;
  highlightId?: string;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onSubmit,
  onReset,
  highlightId,
  value = '',
  withToggle = false,
  isSearch = false,
}) => {
  const [showInput, setShowInput] = useState<boolean>(!withToggle);
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

  const toggleInput = () => {
    if (showInput && text) {
      handleOnSubmit();
    }
    setShowInput((prev) => !prev);
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
      {showInput && (
        <StyledInput
          type='text'
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isSearch ? 'Search tasks' : 'Add a task'}
          isSearch={isSearch}
        />
      )}
      <HighlightedArea id={highlightId ?? ''}>
        <SpriteIcon
          name={isSearch ? 'magnifying' : 'plus'}
          size={4}
          onClick={withToggle ? toggleInput : handleOnSubmit}
        />
      </HighlightedArea>
    </StyledTaskInputContainer>
  );
};
