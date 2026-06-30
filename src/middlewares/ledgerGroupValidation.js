export const validateLedgerGroup = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Company details are required",
    });
  }

  const { company_id, group_name, nature, parent_group_id } = request.body;

  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company identity required",
    });
  }
  if (!group_name) {
    return response.status(400).json({
      success: false,
      message: "Ledger group name required",
    });
  }
  if (!nature) {
    return response.status(400).json({
      success: false,
      message: "Ledger nature required",
    });
  }
  if (!parent_group_id) {
    return response.status(400).json({
      success: false,
      message: "Ledger parent group id required",
    });
  }
  next();
};
