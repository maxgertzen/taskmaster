import { useEffect, useMemo, useState } from 'react';

import { debounce } from '@/shared/utils/debounce';

import { HighlightedArea, SpriteIcon } from '..';

import { StyledInputContainer, StyledInput } from './Input.styled';

interface InputProps {
  placeholder: string;
  onSubmit: (text: string) => void;
  onReset?: () => void;
  isSearch?: boolean;
  value?: string;
  withToggle?: boolean;
  highlightId?: string;
  'data-testid'?: string;
}

export const Input: React.FC<InputProps> = ({
  onSubmit,
  onReset,
  placeholder,
  highlightId,
  value = '',
  withToggle = false,
  isSearch = false,
  'data-testid': dataTestId,
}) => {
  const [showInput, setShowInput] = useState<boolean>(!withToggle || !!value);
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
    <StyledInputContainer data-testid={dataTestId} isSearch={isSearch}>
      {showInput && (
        <StyledInput
          data-testid='input'
          type='text'
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          isSearch={isSearch}
        />
      )}
      <HighlightedArea id={highlightId ?? ''}>
        <SpriteIcon
          data-testid={isSearch ? 'search-icon' : 'add-icon'}
          name={isSearch ? 'magnifying' : 'plus'}
          size={4}
          onClick={withToggle ? toggleInput : handleOnSubmit}
        />
      </HighlightedArea>
    </StyledInputContainer>
  );
};
