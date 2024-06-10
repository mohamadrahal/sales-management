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
