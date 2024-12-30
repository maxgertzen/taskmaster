import { screen, within } from '@testing-library/dom';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { vi } from 'vitest';

import { TestProviders } from './TestProviders';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): ReturnType<typeof render> & {
  user: ReturnType<typeof userEvent.setup>;
} => {
  const { theme, ...renderOptions } = options;

  const user = userEvent.setup();

  return {
    user,
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestProviders theme={theme}>{children}</TestProviders>
      ),
      ...renderOptions,
    }),
  };
};

export const forceClick = (
  element: HTMLElement
): {
  preventDefaultMock: ReturnType<typeof vi.fn>;
} => {
  const preventDefaultMock = vi.fn();

  const mockClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  Object.defineProperty(mockClickEvent, 'preventDefault', {
    value: preventDefaultMock,
  });

  element.dispatchEvent(mockClickEvent);

  return { preventDefaultMock };
};

export { customRender as render, within, screen, userEvent };
