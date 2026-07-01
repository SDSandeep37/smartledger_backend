import UnitModel from "../models/unitModel.js";

export async function createUnit(request, response) {
  try {
    const unitData = request.body;
    const newUnit = await UnitModel.createUnit(unitData);

    return response.status(201).json({
      success: true,
      message: "Unit created successfully",
      newUnit,
    });
  } catch (error) {
    console.error("Error creating unit:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to create unit",
    });
  }
}

//update an existing unit
export async function updateUnit(request, response) {
  try {
    const unitId = request.params.id;
    const unitData = request.body;
    const updatedUnit = await UnitModel.updateUnit(unitId, unitData);
    return response.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: updatedUnit,
    });
  } catch (error) {
    console.error("Error updating unit:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to update unit",
    });
  }
}

//get all units for a specific company
export async function getUnitsByCompanyController(request, response) {
  try {
    const { companyId } = request.params;
    const units = await UnitModel.getUnitsByCompany(companyId);
    return response.status(200).json({
      success: true,
      message: "All units list for this company",
      units,
    });
  } catch (error) {
    console.error("Error fetching units:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch units",
    });
  }
}

//get unit by its ID
export async function getUnitByIdController(request, response) {
  try {
    const { unitId } = request.params;
    const unit = await UnitModel.getUnitById(unitId);
    if (!unit) {
      return response.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Unit details",
      unit,
    });
  } catch (error) {
    console.error("Error fetching unit by ID:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch unit",
    });
  }
}

// delete a unit by its ID
export async function deleteUnitController(request, response) {
  try {
    const { unitId } = request.params;
    const deletedUnit = await UnitModel.deleteUnit(unitId);
    if (!deletedUnit) {
      return response.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "Unit deleted successfully",
      deletedUnit,
    });
  } catch (error) {
    console.error("Error deleting unit:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to delete unit",
    });
  }
}
