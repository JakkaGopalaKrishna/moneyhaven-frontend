export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const CATEGORIES = {
  [TRANSACTION_TYPES.INCOME]: [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other',
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Healthcare',
    'Entertainment',
    'Education',
    'Other',
  ],
};

export const PAYMENT_METHODS = [
  'UPI',
];

export const CATEGORY_COLORS = {
  'Salary': 'green',
  'Freelance': 'cyan',
  'Business': 'blue',
  'Investment': 'purple',
  'Food': 'orange',
  'Travel': 'volcano',
  'Shopping': 'magenta',
  'Bills': 'blue',
  'Healthcare': 'red',
  'Entertainment': 'gold',
  'Education': 'geekblue',
  'Other': 'default',
};
