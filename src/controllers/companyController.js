import CompanyModel from "../models/companyModel.js";

export async function createCompany(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access",
    });
  }
  const { id: user_id } = request.user;

  const companyCount = await CompanyModel.countCompaniesByUser(user_id);
  if (companyCount >= 5) {
    return response.status(400).json({
      success: false,
      message: "Maximum 5 companies allowed.",
    });
  }
  try {
    const company = await CompanyModel.create({
      ...request.body,
      user_id,
    });

    return response.status(201).json({
      success: true,
      message: "Company Created Successfully.",
      company,
    });
  } catch (error) {
    console.log("Error while creating company", error);
    response.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
}

//update company controller
export async function updateCompany(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access",
    });
  }
  const { id: user_id } = request.user;
  const { companyId } = request.params;

  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company identity is required",
    });
  }

  try {
    const company = await CompanyModel.update(
      companyId,
      {
        ...request.body,
      },
      user_id,
    );

    return response.status(201).json({
      success: true,
      message: "Company updated Successfully.",
      company,
    });
  } catch (error) {
    console.log("Error while updating company", error);
    response.status(500).json({
      success: false,
      message: "Failed to update company",
    });
  }
}

//get company by it's id

export async function getCompanyContoller(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access",
    });
  }
  const { companyId } = request.params;

  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company identity is required",
    });
  }
  try {
    const company = await CompanyModel.getCompanyById(companyId);
    return response.json({
      success: true,
      message: "Company Details",
      company,
    });
  } catch (error) {
    console.log("Error while fetching company", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch company details",
    });
  }
}

//get all companies of a user
export async function getCompaniesOfUserContoller(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access",
    });
  }
  const { id: user_id } = request.user;
  try {
    const companies = await CompanyModel.getCompaniesByUserId(user_id);
    return response.json({
      success: true,
      message: "Companies Details",
      companies,
    });
  } catch (error) {
    console.log("Error while fetching companies", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch companies details",
    });
  }
}

//delete a company: only the owner can delete the company
export async function deleteCompanyContoller(request, response) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorised access",
    });
  }
  const { id: user_id } = request.user;
  const { companyId } = request.params;

  if (!companyId) {
    return response.status(400).json({
      success: false,
      message: "Company identity is required",
    });
  }
  try {
    const company = await CompanyModel.delete(companyId, user_id);
    return response.json({
      success: true,
      message: "Company deleted successfully",
      company,
    });
  } catch (error) {
    console.log("Error while deleting company.", error);
    response.status(500).json({
      success: false,
      message: "Failed to deleting company.",
    });
  }
}

export async function searchCompaniesController(request, response) {
  if (!request.params) {
    return response.status(400).json({
      success: false,
      message: "Company name required",
    });
  }

  const company_name = request.query.companyName.trim();

  try {
    const searchResult = await CompanyModel.serachCompanyByName(company_name);
    return response.json({
      success: true,
      message: "List of all the companies",
      company: searchResult,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
