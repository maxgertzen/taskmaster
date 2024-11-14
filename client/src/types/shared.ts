export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type List = {
  id: string;
  name: string;
};

export type User = {
  name: string;
};

export type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
