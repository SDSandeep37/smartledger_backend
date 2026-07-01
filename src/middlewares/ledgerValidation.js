export const validateLedger = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Ledger details are required",
    });
  }
  const { company_id, group_id, ledger_name, opening_balance, balance_type } =
    request.body;

  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company identity required",
    });
  }
  if (!group_id) {
    return response.status(400).json({
      success: false,
      message: "Ledger group identity required",
    });
  }
  if (!ledger_name) {
    return response.status(400).json({
      success: false,
      message: "Ledger name required",
    });
  }

  if (!opening_balance) {
    return response.status(400).json({
      success: false,
      message: "Ledger opening balance required",
    });
  }
  if (!balance_type) {
    return response.status(400).json({
      success: false,
      message: "Ledger balance type required",
    });
  }
  next();
};
