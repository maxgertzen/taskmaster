import { FC } from 'react';

import { useThemeStore } from '../../store/themeStore';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

import { StyledSwitchThemeButton } from './SwitchThemeButton.styled';

interface SwitchThemeButtonProps {
  withText?: boolean;
}
export const SwitchThemeButton: FC<SwitchThemeButtonProps> = ({ withText }) => {
  const activeTheme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleToggle = () => {
    toggleTheme();
  };

  if (withText) {
    return (
      <StyledSwitchThemeButton role='button' onClick={toggleTheme}>
        <SpriteIcon
          alt='switch theme'
          name={activeTheme === 'light' ? 'moon' : 'sun'}
        />
        <label>{activeTheme === 'light' ? 'Dark' : 'Light'}</label>
      </StyledSwitchThemeButton>
    );
  }

  return (
    <SpriteIcon
      alt='switch theme'
      name={activeTheme === 'light' ? 'moon' : 'sun'}
      onClick={handleToggle}
    />
  );
};
