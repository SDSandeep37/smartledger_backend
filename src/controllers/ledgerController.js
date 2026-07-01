import LedgersModel from "../models/ledgersModel.js";

//create ledger controller
export async function createLedger(request, response) {
  const data = request.body;
  const { company_id, ledger_name } = data;
  try {
    //check if ledger exist for the company
    const ledgerExist = await LedgersModel.ledgerExist(company_id, ledger_name);
    if (ledgerExist > 0) {
      return response.status(400).json({
        success: false,
        message: "A ledger already exist with this name",
      });
    }
    const newLedger = await LedgersModel.create(data);
    return response.status(201).json({
      success: true,
      message: "Ledger saved successfully",
      newLedger,
    });
  } catch (error) {
    console.log("Error while creating ledger", error);
    response.status(500).json({
      success: false,
      message: "Failed to create ledger",
    });
  }
}
//update ledger controller
export async function updateLedger(request, response) {
  const data = request.body;
  const { company_id, ledger_name } = data;
  const { ledgerId } = request.params;
  try {
    //check if ledger exist for the company
    const ledgerExist = await LedgersModel.ledgerExist(company_id, ledger_name);
    if (ledgerExist > 0) {
      return response.status(400).json({
        success: false,
        message: "A ledger already exist with this name",
      });
    }
    const updatedLedger = await LedgersModel.updateById(ledgerId, data);
    return response.status(200).json({
      success: true,
      message: "Ledger updated successfully",
      updatedLedger,
    });
  } catch (error) {
    console.log("Error while updating ledger", error);
    response.status(500).json({
      success: false,
      message: "Failed to update ledger",
    });
  }
}

//fetch ledger by company id controller
export async function getLedgersByCompanyId(request, response) {
  const { companyId } = request.params;
  try {
    const ledgers = await LedgersModel.findAllByCompany(companyId);
    return response.status(200).json({
      success: true,
      message: "List of all ledgers for the company",
      ledgers,
    });
  } catch (error) {
    console.log("Error while fetching ledgers", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch ledgers",
    });
  }
}

//fetch ledger by id controller
export async function getLedgerById(request, response) {
  const { ledgerId } = request.params;
  try {
    const ledger = await LedgersModel.findById(ledgerId);
    if (!ledger) {
      return response.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Ledger details",
      ledger,
    });
  } catch (error) {
    console.log("Error while fetching ledger", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch ledger",
    });
  }
}

//delete ledger by id controller
export async function deleteLedgerById(request, response) {
  const { ledgerId } = request.params;
  try {
    const deletedLedger = await LedgersModel.deleteById(ledgerId);
    if (!deletedLedger) {
      return response.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Ledger deleted successfully",
      deletedLedger,
    });
  } catch (error) {
    console.log("Error while deleting ledger", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete ledger",
    });
  }
}
