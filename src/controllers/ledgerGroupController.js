import LedgerGroupModel from "../models/ledgerGroupModel.js";

export async function createLedgerGroup(request, response) {
  const { company_id, group_name } = request.body;
  try {
    //check if ledger group exist for the company
    const groupExist = await LedgerGroupModel.ledgerGroupExist(
      company_id,
      group_name,
    );

    if (groupExist > 0) {
      return response.status(400).json({
        success: false,
        message: "A ledger group already exist with this name",
      });
    }

    //save the new ledger group
    const data = request.body;
    const ledgerGroup = await LedgerGroupModel.create(data);
    if (!ledgerGroup) {
      return response.status(500).json({
        success: false,
        message: "Not able to create the ledger group",
      });
    }
    return response.status(201).json({
      success: true,
      message: "Ledger group saved successfully",
      ledgerGroup,
    });
  } catch (error) {
    console.log("Error while creating ledger group", error);
    response.status(500).json({
      success: false,
      message: "Failed to create ledger group",
    });
  }
}

//update ledger group controller
export async function updateLedgerGroup(request, response) {
  const { company_id, group_name } = request.body;
  const { ledgerGroupId } = request.params;
  try {
    //check if ledger group exist for the company
    const groupExist = await LedgerGroupModel.ledgerGroupExist(
      company_id,
      group_name,
    );

    if (groupExist > 0) {
      return response.status(400).json({
        success: false,
        message: "A ledger group already exist with this name",
      });
    }

    //save the new ledger group
    const data = request.body;
    const updatedLedgerGroup = await LedgerGroupModel.update(
      ledgerGroupId,
      data,
    );
    if (!updatedLedgerGroup) {
      return response.status(500).json({
        success: false,
        message: "Not able to update the ledger group",
      });
    }
    return response.status(201).json({
      success: true,
      message: "Ledger group updated successfully",
      updatedLedgerGroup,
    });
  } catch (error) {
    console.log("Error while updating ledger group", error);
    response.status(500).json({
      success: false,
      message: "Failed to update ledger group",
    });
  }
}

// get all the ledger group for a company
export async function getAllLG4Company(request, response) {
  const { companyId } = request.params;
  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company identity required",
    });
  }
  try {
    const ledgerGroups = await LedgerGroupModel.getAllByCompanyId(companyId);
    if (!ledgerGroups) {
      return response.status(500).json({
        success: false,
        message: "Failed to fetch ledger groups!",
      });
    }
    return response.json({
      success: true,
      message: "List of all the legder groups",
      ledgerGroups,
    });
  } catch (error) {
    console.log("Error while fetching ledger groups", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch ledger groups",
    });
    /* DB error code: '22P02' means invalid input syntax for type uuid*/
  }
}

//get ledger group by it's id
export async function getLGById(request, response) {
  const { id } = request.params;
  if (!id) {
    return response.status(400).json({
      success: false,
      message: "Ledger group ID required",
    });
  }
  try {
    const ledgerGroup = await LedgerGroupModel.getById(id);
    if (!ledgerGroup) {
      return response.status(500).json({
        success: false,
        message: "Failed to fetch ledger group!",
      });
    }
    return response.json({
      success: true,
      message: "The legder group",
      ledgerGroup,
    });
  } catch (error) {
    console.log("Error while fetching ledger group", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch ledger group",
    });
  }
}

export async function deleteLG(request, response) {
  const { id } = request.params;
  if (!id) {
    return response.status(400).json({
      success: false,
      message: "Ledger group ID required",
    });
  }
  try {
    const ledgerGroup = await LedgerGroupModel.delete(id);
    if (!ledgerGroup) {
      return response.status(500).json({
        success: false,
        message: "Failed to delete ledger group!",
      });
    }
    return response.json({
      success: true,
      message: "Ledger group deleted successfully",
      ledgerGroup,
    });
  } catch (error) {
    console.log("Error while deleting ledger group", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete ledger group",
    });
  }
}
