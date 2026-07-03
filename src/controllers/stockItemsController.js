import StockItemsModel from "../models/stockItemsModel.js";
import StockGroupModel from "../models/stockGroupModel.js";
import UnitModel from "../models/unitModel.js";

export async function createStockItem(request, response) {
  const stockItem = request.body;
  const { company_id, stock_group_id, unit_id, item_name } = stockItem;
  try {
    //check if stock group exists
    if (stock_group_id) {
      const stockGroup =
        await StockGroupModel.getStockGroupById(stock_group_id);
      if (!stockGroup) {
        return response.status(404).json({
          success: false,
          message: "Stock group not found",
        });
      }
    }
    //check if unit exists
    if (unit_id) {
      const unit = await UnitModel.getUnitById(unit_id);
      if (!unit) {
        return response.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }
    }
    ///check duplicate stock item
    const exists = await StockItemsModel.checkStockItemExists(
      company_id,
      item_name,
    );
    if (exists) {
      return response.status(409).json({
        success: false,
        message: "Stock Item already exists.",
      });
    }
    const createdStockItem = await StockItemsModel.createStockItem(stockItem);
    response.status(201).json({
      success: true,
      message: "Stock item created successfully",
      stockItem: createdStockItem,
    });
  } catch (error) {
    console.error("Error creating stock item:", error);
    response.status(500).json({
      success: false,
      message: "Failed to create stock item",
    });
  }
}

//update stock item
export async function updateStockItem(request, response) {
  const stockItemId = request.params.itemId;
  const stockItem = request.body;
  const { item_name } = stockItem;
  try {
    //check if stock item exists
    const existingStockItem =
      await StockItemsModel.getStockItemById(stockItemId);
    if (!existingStockItem) {
      return response.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }
    // //check duplicate stock item
    // const exists = await StockItemsModel.checkStockItemExists(
    //   existingStockItem.company_id,
    //   item_name,
    // );
    // if (exists) {
    //   return response.status(409).json({
    //     success: false,
    //     message: "Stock Item already exists.",
    //   });
    // }
    const updatedStockItem = await StockItemsModel.updateStockItem(
      stockItem,
      stockItemId,
    );
    response.status(200).json({
      success: true,
      message: "Stock item updated successfully",
      stockItem: updatedStockItem,
    });
  } catch (error) {
    console.error("Error updating stock item:", error);
    response.status(500).json({
      success: false,
      message: "Failed to update stock item",
    });
  }
}
//get stock item by id
export async function getStockItemById(request, response) {
  const stockItemId = request.params.itemId;
  try {
    const stockItem = await StockItemsModel.getStockItemById(stockItemId);
    if (!stockItem) {
      return response.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }
    return response.status(200).json({
      success: true,
      stockItem: stockItem,
    });
  } catch (error) {
    console.error("Error retrieving stock item:", error);
    response.status(500).json({
      success: false,
      message: "Failed to retrieve stock item",
    });
  }
}
//get all stock items for a company
export async function getStockItemsController(request, response) {
  const { companyId } = request.params;

  try {
    const stockItems =
      await StockItemsModel.getAllStockItemsByCompanyId(companyId);

    return response.json({
      success: true,
      stockItems,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: "Failed to fetch stock items.",
    });
  }
}

// Delete Stock Item
export async function deleteStockItemController(request, response) {
  const { itemId } = request.params;

  try {
    const isItemExist = await StockItemsModel.getStockItemById(itemId);
    if (!isItemExist) {
      return response.status(404).json({
        success: false,
        message: "Stock Item not found.",
      });
    }
    const deletedItem = await StockItemsModel.deleteStockItemById(itemId);

    return response.json({
      success: true,
      message: "Stock Item deleted successfully.",
      deletedItem,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: "Failed to delete stock item.",
    });
  }
}

//search stock items with item_name or SKU- Stock Keeping Unit.
export async function searchStockItemsController(request, response) {
  const { companyId } = request.params;
  const { search } = request.query;

  try {
    const items = await StockItemsModel.searchStockItems(companyId, search);

    return response.json({
      success: true,
      stockItems: items,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: "Failed to search stock items.",
    });
  }
}
