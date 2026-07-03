import StockGroupModel from "../models/stockGroupModel.js";

export async function createStockGroupController(request, response) {
  const { company_id, group_name, parent_group_id } = request.body;
  try {
    // Check if the stock group name already exists for the company
    const nameExists = await StockGroupModel.checkStockGroupNameExists(
      company_id,
      group_name,
    );
    if (nameExists) {
      return response.status(400).json({
        success: false,
        message: "Stock group name already exists for this company.",
      });
    }
    //validate parent group if provided
    if (parent_group_id) {
      const parentExists = await StockGroupModel.checkParentExists(
        company_id,
        parent_group_id,
      );
      if (!parentExists) {
        return response.status(400).json({
          success: false,
          message: "Parent group does not exist for this company.",
        });
      }
    }
    //save stock group
    const newStockGroup = await StockGroupModel.create({
      company_id,
      group_name,
      parent_group_id,
    });
    return response.status(201).json({
      success: true,
      message: "Stock group created successfully",
      stockGroup: newStockGroup,
    });
  } catch (error) {
    console.error("Error creating stock group:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//update stock group
export async function updateStockGroupController(request, response) {
  const { group_id } = request.params;
  const { company_id, group_name, parent_group_id } = request.body;
  if (!group_id) {
    return response.status(400).json({
      success: false,
      message: "Stock group identity required",
    });
  }
  try {
    // Check if the stock group exists
    const stockGroup = await StockGroupModel.getStockGroupById(group_id);
    if (!stockGroup) {
      return response.status(404).json({
        success: false,
        message: "Stock group not found",
      });
    }
    //prevent parent group being set to itself
    if (parent_group_id && parent_group_id === group_id) {
      return response.status(400).json({
        success: false,
        message: "A stock group cannot be its own parent.",
      });
    }

    //check if the stock group name already exists for the company
    if (group_name && group_name !== stockGroup.group_name) {
      const nameExists = await StockGroupModel.checkStockGroupNameExists(
        company_id,
        group_name,
      );
      if (nameExists) {
        return response.status(400).json({
          success: false,
          message: "Stock group name already exists for this company.",
        });
      }
    }
    //checkk if parent group exists for the company
    if (parent_group_id) {
      const parentExists = await StockGroupModel.checkParentExists(
        company_id,
        parent_group_id,
      );
      if (!parentExists) {
        return response.status(400).json({
          success: false,
          message: "Parent group does not exist for this company.",
        });
      }
    }

    //update stock group
    const updatedStockGroup = await StockGroupModel.update(
      {
        group_name,
        parent_group_id,
      },
      group_id,
    );
    return response.status(200).json({
      success: true,
      message: "Stock group updated successfully",
      stockGroup: updatedStockGroup,
    });
  } catch (error) {
    console.error("Error updating stock group:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//get stock group by id
export async function getStockGroupByIdController(request, response) {
  const { groupId } = request.params;
  try {
    const stockGroup = await StockGroupModel.getStockGroupById(groupId);
    if (!stockGroup) {
      return response.status(404).json({
        success: false,
        message: "Stock group not found",
      });
    }
    return response.status(200).json({
      success: true,
      stockGroup,
    });
  } catch (error) {
    console.error("Error fetching stock group:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//get all stock groups for a company
export async function getAllStockGroupsController(request, response) {
  const { companyId } = request.params;
  try {
    const stockGroups =
      await StockGroupModel.getStockGroupsByCompanyId(companyId);
    return response.status(200).json({
      success: true,
      stockGroups,
    });
  } catch (error) {
    console.error("Error fetching stock groups:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//delete stock group
export async function deleteStockGroupController(request, response) {
  const { groupId } = request.params;
  try {
    const stockGroup = await StockGroupModel.getStockGroupById(groupId);
    if (!stockGroup) {
      return response.status(404).json({
        success: false,
        message: "Stock group not found",
      });
    }
    //check if the stock group has child groups
    const childGroups = await StockGroupModel.getChildStockGroups(groupId);
    if (childGroups.length > 0) {
      return response.status(400).json({
        success: false,
        message:
          "Cannot delete stock group with child groups. Please reassign or delete child groups first.",
      });
    }

    //delete stock group
    const deletedStockGroup = await StockGroupModel.delete(groupId);
    if (!deletedStockGroup) {
      return response.status(500).json({
        success: false,
        message: "Failed to delete stock group",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Stock group deleted successfully",
      stockGroup: deletedStockGroup,
    });
  } catch (error) {
    console.error("Error deleting stock group:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//search stock groups by name for a company
export async function searchStockGroupsController(request, response) {
  const { companyId } = request.params;
  const { groupName } = request.query;
  if (!groupName) {
    return response.status(400).json({
      success: false,
      message: "Stock group name query parameter is required",
    });
  }
  try {
    const stockGroups = await StockGroupModel.searchStockGroupsByName(
      companyId,
      groupName,
    );
    return response.status(200).json({
      success: true,
      stockGroups,
    });
  } catch (error) {
    console.error("Error searching stock groups:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
