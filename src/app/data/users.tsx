const users = [
  {
    id: 1,
    name: "سامي",
    email: "admin@example.com",
    password: "123",
    role: "Admin",
  },
  {
    id: 2,
    name: "كريم",
    email: "salesmanager@example.com",
    password: "123",
    role: "Sales Manager",
  },
  {
    id: 3,
    name: "نادر",
    email: "salesman@example.com",
    password: "123",
    role: "Salesman",
  },
  // More users...
];
export const getUsers = () => users;
