export const validateStockGroup = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Stock group details are required",
    });
  }
  const { company_id, group_name } = request.body;

  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company identity required",
    });
  }
  if (!group_name) {
    return response.status(400).json({
      success: false,
      message: "Stock Group name required",
    });
  }

  next();
};
