const DEFAULT_LEDGERS = [
  {
    ledger_name: "Cash",
    group_name: "Cash-in-Hand",
    alias_name: "Cash",
    opening_balance: 0,
    balance_type: "Dr",
  },
  {
    ledger_name: "Sales",
    group_name: "Sales Accounts",
    alias_name: "Sales",
    opening_balance: 0,
    balance_type: "Cr",
  },
  {
    ledger_name: "Purchases",
    group_name: "Purchase Accounts",
    alias_name: "Purchases",
    opening_balance: 0,
    balance_type: "Dr",
  },
  {
    ledger_name: "Bank",
    group_name: "Bank Accounts",
    alias_name: "Bank",
    opening_balance: 0,
    balance_type: "Dr",
  },
  {
    ledger_name: "Sundry Debtors",
    group_name: "Sundry Debtors",
    alias_name: "Sundry Debtors",
    opening_balance: 0,
    balance_type: "Dr",
  },
  {
    ledger_name: "Sundry Creditors",
    group_name: "Sundry Creditors",
    alias_name: "Sundry Creditors",
    opening_balance: 0,
    balance_type: "Cr",
  },
];

export default DEFAULT_LEDGERS;
