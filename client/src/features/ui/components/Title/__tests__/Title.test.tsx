import { describe, it, expect } from 'vitest';

import { render } from '@/tests/utils';

import { Title } from '../Title';

describe('Title', () => {
  it.each([
    ['h1', 'Test Title'],
    ['h2', 'Subtitle'],
    ['h3', 'Small Title'],
  ])('renders %s heading correctly', (variant, text) => {
    const { container } = render(
      <Title variant={variant as 'h1' | 'h2' | 'h3'}>{text}</Title>
    );
    expect(container).toMatchSnapshot();
  });

  it('applies custom color when provided', () => {
    const { container } = render(
      <Title variant='h1' color='red'>
        Colored Title
      </Title>
    );
    expect(container).toMatchSnapshot();
  });
});
