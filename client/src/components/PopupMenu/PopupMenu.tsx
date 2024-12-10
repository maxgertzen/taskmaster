import { FC, ReactNode, useEffect, useRef, useState } from 'react';

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
}

export const PopupMenu: FC<PopupMenuProps> = ({
  options,
  onClose,
  isOpen,
  triggerRef,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: triggerRect.bottom + window.scrollY,
        left: triggerRect.left + window.scrollX,
      });
    }
  }, [isOpen, triggerRef]);

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
      top={menuPosition.top}
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
