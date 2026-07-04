export const validateVoucher = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Voucher details are required",
    });
  }

  const {
    company_id,
    voucher_type,
    financial_year,
    voucher_date,
    party_ledger_id,
    items,
  } = request.body;

  if (!company_id) {
    return response.status(400).json({
      success: false,
      message: "Company identity is required",
    });
  }

  if (!voucher_type) {
    return response.status(400).json({
      success: false,
      message: "Voucher type is required",
    });
  }

  if (!["Purchase", "Sales"].includes(voucher_type)) {
    return response.status(400).json({
      success: false,
      message: "Voucher type must be either Purchase or Sales",
    });
  }

  if (!financial_year) {
    return response.status(400).json({
      success: false,
      message: "Financial year is required",
    });
  }

  if (!voucher_date) {
    return response.status(400).json({
      success: false,
      message: "Voucher date is required",
    });
  }

  if (!party_ledger_id) {
    return response.status(400).json({
      success: false,
      message: "Party ledger is required",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({
      success: false,
      message: "At least one voucher item is required",
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.stock_item_id) {
      return response.status(400).json({
        success: false,
        message: `Stock item is required for item ${i + 1}`,
      });
    }

    if (item.quantity == null || Number(item.quantity) <= 0) {
      return response.status(400).json({
        success: false,
        message: `Valid quantity is required for item ${i + 1}`,
      });
    }

    if (item.rate == null || Number(item.rate) < 0) {
      return response.status(400).json({
        success: false,
        message: `Valid rate is required for item ${i + 1}`,
      });
    }

    if (
      item.discount_percent != null &&
      (Number(item.discount_percent) < 0 || Number(item.discount_percent) > 100)
    ) {
      return response.status(400).json({
        success: false,
        message: `Discount percent must be between 0 and 100 for item ${i + 1}`,
      });
    }

    if (
      item.gst_percent != null &&
      (Number(item.gst_percent) < 0 || Number(item.gst_percent) > 100)
    ) {
      return response.status(400).json({
        success: false,
        message: `GST percent must be between 0 and 100 for item ${i + 1}`,
      });
    }
  }

  next();
};
