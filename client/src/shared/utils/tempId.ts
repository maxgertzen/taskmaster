export const generateTempId = (prefix: string = 'temp') =>
  `${prefix}-${Date.now()}`;
