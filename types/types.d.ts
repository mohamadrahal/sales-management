declare global {
  type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  };
}

export {};

export interface Team {
  id: number;
  name: string;
  location: string;
  salesmenCount: number;
}
