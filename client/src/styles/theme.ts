const baseSpacing = 8;

const spacing = (...values: number[]) =>
  values.map((value) => `${value * baseSpacing}px`).join(' ');

const createMainBorderFunction =
  (color: string) => (customColor?: string, customWidth?: number) =>
    `${customWidth ? `${customWidth}px` : '1px'} solid ${customColor || color}`;

const baseTheme = {
  typography: {
    fontFamily: 'monospace',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    h5: { fontSize: '1.125rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body: { fontSize: '1rem', fontWeight: 400 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
  spacing,
  borders: {
    color: '#e1f0f6',
    radius: '0.75rem',
    width: '0.0625rem',
  },
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#1400ff',
    secondary: '#3a8ba2',
    background: '#fdf7ff',
    surface: '#e1f0f6',
    text: '#1e1926',
    accent: '#9a89b4',
    grey: '#afa8ba',
  },
  borders: {
    ...baseTheme.borders,
    color: '#afa8ba',
    main: createMainBorderFunction('#afa8ba'),
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#fdf7ff',
    secondary: '#9a89b4',
    background: '#1e1926',
    surface: '#362b48',
    text: '#fdf7ff',
    accent: '#1400ff',
    grey: '#fef6ff',
  },
  borders: {
    ...baseTheme.borders,
    color: '#fef6ff',
    main: createMainBorderFunction('#fef6ff'),
  },
};
