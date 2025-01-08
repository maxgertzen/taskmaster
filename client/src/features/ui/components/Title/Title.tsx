import { createElement, FC, ReactNode } from 'react';

import { Headings } from '@/shared/types/ui';

interface TitleProps {
  variant: Headings;
  color?: string;
  children: ReactNode;
}

export const Title: FC<TitleProps> = ({ variant, color, children }) => {
  return createElement(variant, { css: { color } }, children);
};
