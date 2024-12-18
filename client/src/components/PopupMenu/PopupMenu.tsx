import { FC, ReactNode, useEffect, useRef } from 'react';

import { MenuContainer, MenuItem } from './PopupMenu.styled';

interface PopupMenuProps {
  options: Array<{
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }>;
  onClose: () => void;
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  orientation?: 'left' | 'right' | 'full';
}

export const PopupMenu: FC<PopupMenuProps> = ({
  options,
  onClose,
  isOpen,
  triggerRef,
  orientation = 'left',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mouseup', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <MenuContainer
      ref={menuRef}
      role='menu'
      aria-labelledby='popup-menu-trigger'
      orientation={orientation}
      onClick={(event) => event.stopPropagation()}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          role='menuitem'
          onClick={() => {
            if (!option.disabled) {
              option?.onClick?.();
              onClose();
            }
          }}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </MenuContainer>
  );
};
