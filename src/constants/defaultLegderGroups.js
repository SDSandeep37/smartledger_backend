const DEFAULT_LEDGER_GROUPS = [
  {
    group_name: "Assets",
    nature: "Assets",
    parent_group: null,
  },
  {
    group_name: "Liabilities",
    nature: "Liabilities",
    parent_group: null,
  },
  {
    group_name: "Income",
    nature: "Income",
    parent_group: null,
  },
  {
    group_name: "Expenses",
    nature: "Expenses",
    parent_group: null,
  },
  {
    group_name: "Cash-in-Hand",
    nature: "Assets",
    parent_group: "Assets",
  },
  {
    group_name: "Bank Accounts",
    nature: "Assets",
    parent_group: "Assets",
  },
  {
    group_name: "Sundry Debtors",
    nature: "Assets",
    parent_group: "Assets",
  },
  {
    group_name: "Sundry Creditors",
    nature: "Liabilities",
    parent_group: "Liabilities",
  },
  {
    group_name: "Sales Account",
    nature: "Income",
    parent_group: "Income",
  },
  {
    group_name: "Purchase Account",
    nature: "Expenses",
    parent_group: "Expenses",
  },
];

export default DEFAULT_LEDGER_GROUPS;
