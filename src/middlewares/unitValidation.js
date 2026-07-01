export const validateUnitData = (request, response, next) => {
  const { company_id, unit_name, unit_symbol } = request.body;

  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }
  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company ID is required",
    });
  }
  if (!unit_name) {
    return response.status(400).json({
      success: false,
      message: "Unit name is required",
    });
  }
  if (!unit_symbol) {
    return response.status(400).json({
      success: false,
      message: "Unit symbol is required",
    });
  }
  next();
};
