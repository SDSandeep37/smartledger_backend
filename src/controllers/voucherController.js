import VoucherService from "../services/voucherService.js";
import VoucherModel from "../models/voucherModel.js";

// Create Purchase / Sales Voucher
export async function createVoucherController(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const { id: userId } = request.user;

  try {
    const voucher = await VoucherService.createVoucher(request.body, userId);

    return response.status(201).json({
      success: true,
      message: `${voucher.voucher_type} voucher created successfully.`,
      voucher,
    });
  } catch (error) {
    console.error("Error creating voucher:", error);

    return response.status(500).json({
      success: false,
      message: error.message || "Failed to create voucher.",
    });
  }
}

// Get Voucher By ID
export async function getVoucherController(request, response) {
  const { voucherId } = request.params;

  if (!voucherId) {
    return response.status(400).json({
      success: false,
      message: "Voucher ID is required.",
    });
  }

  try {
    const voucher = await VoucherModel.getById(voucherId);

    if (!voucher) {
      return response.status(404).json({
        success: false,
        message: "Voucher not found.",
      });
    }

    return response.json({
      success: true,
      voucher,
    });
  } catch (error) {
    console.error("Error fetching voucher:", error);

    return response.status(500).json({
      success: false,
      message: "Failed to fetch voucher.",
    });
  }
}

// Get All Vouchers Of Company
export async function getCompanyVouchersController(request, response) {
  const { companyId } = request.params;

  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company ID is required.",
    });
  }

  try {
    const vouchers = await VoucherModel.getByCompany(companyId);

    return response.json({
      success: true,
      vouchers,
    });
  } catch (error) {
    console.error("Error fetching vouchers:", error);

    return response.status(500).json({
      success: false,
      message: "Failed to fetch vouchers.",
    });
  }
}

// Update Voucher Header
export async function updateVoucherController(request, response) {
  const { voucherId } = request.params;

  if (!voucherId) {
    return response.status(400).json({
      success: false,
      message: "Voucher ID is required.",
    });
  }

  try {
    const voucher = await VoucherModel.update(voucherId, request.body);

    if (!voucher) {
      return response.status(404).json({
        success: false,
        message: "Voucher not found.",
      });
    }

    return response.json({
      success: true,
      message: "Voucher updated successfully.",
      voucher,
    });
  } catch (error) {
    console.error("Error updating voucher:", error);

    return response.status(500).json({
      success: false,
      message: "Failed to update voucher.",
    });
  }
}

// Delete Voucher
export async function deleteVoucherController(request, response) {
  const { voucherId } = request.params;

  if (!voucherId) {
    return response.status(400).json({
      success: false,
      message: "Voucher ID is required.",
    });
  }

  try {
    await VoucherService.deleteVoucher(voucherId);

    return response.json({
      success: true,
      message: "Voucher deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting voucher:", error);

    return response.status(500).json({
      success: false,
      message: error.message || "Failed to delete voucher.",
    });
  }
}

// Search Voucher by voucher number or ledger_name
export async function searchVoucherController(request, response) {
  const { companyId } = request.params;
  const { keyword } = request.query;

  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company ID is required.",
    });
  }

  try {
    const vouchers = await VoucherModel.search(companyId, keyword.trim());

    return response.json({
      success: true,
      vouchers,
    });
  } catch (error) {
    console.error("Error searching vouchers:", error);

    return response.status(500).json({
      success: false,
      message: "Failed to search vouchers.",
    });
  }
}
