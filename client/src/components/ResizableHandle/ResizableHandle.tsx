import React, { FC } from 'react';

import { StyledResizableHandle } from './ResizableHandle.styled';

interface ResizableHandleProps {
  onResize: (isResizing: boolean) => void;
  minWidth?: number;
  maxWidth?: number;
  initialWidth: number;
  setWidth: (newWidth: number) => void;
}

export const ResizableHandle: FC<ResizableHandleProps> = ({
  onResize,
  minWidth = 150,
  maxWidth = 500,
  initialWidth,
  setWidth,
}) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startX;
      const newWidth = initialWidth + deltaX;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      setWidth(clampedWidth);
      onResize(true);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      onResize(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return <StyledResizableHandle onMouseDown={handleMouseDown} />;
};
