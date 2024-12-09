import { useState } from 'react';

export const usePopupMenuState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  return { isOpen, toggleMenu, closeMenu, openMenu };
};
