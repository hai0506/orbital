const sharedCart = [
  { item: "Apple", quantity: 3, price: 1.2 },
  { item: "Orange", quantity: 2, price: 1.5 },
  { item: "Banana", quantity: 5, price: 0.8 }
];

const transactions = [
  {
    name: "Alice Tan",
    phone: "91234567",
    email: "alice@example.com",
    payment: "PayLah",
    cart: sharedCart
  },
  {
    name: "Ben Lim",
    phone: "98765432",
    email: "ben.lim@example.com",
    payment: "PayNow",
    cart: sharedCart
  },
  {
    name: "Cheryl Goh",
    phone: "93332211",
    email: "cheryl.g@example.com",
    payment: "Cash",
    cart: sharedCart
  },
  {
    name: "Daniel Wong",
    phone: "95556677",
    email: "daniel.w@example.com",
    payment: "NETS",
    cart: sharedCart
  },
  {
    name: "Eunice Tan",
    phone: "91118888",
    email: "eunice.tan@example.com",
    payment: "Others",
    cart: sharedCart
  }
];

export default transactions;