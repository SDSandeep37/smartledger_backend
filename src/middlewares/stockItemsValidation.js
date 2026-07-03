export const validateStockItem = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Stock item details are required",
    });
  }
  const { company_id, stock_group_id, item_name, sku, unit_id } = request.body;

  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company identity required",
    });
  }
  if (!item_name) {
    return response.status(400).json({
      success: false,
      message: "Stock item name required",
    });
  }
  if (!sku) {
    return response.status(400).json({
      success: false,
      message: "Stock item SKU required",
    });
  }
  if (!unit_id) {
    return response.status(400).json({
      success: false,
      message: "Stock item unit required",
    });
  }

  next();
};
