import { emailValidator, phoneValidator } from "../utils/validator.js";

export const validateCompany = (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Company details are required",
    });
  }
  const { company_name, address, city, state, country, pincode, email, phone } =
    request.body;

  if (!company_name?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Company name required",
    });
  }
  if (!address?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Company address required",
    });
  }
  if (!city?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Please provide the company city",
    });
  }
  if (!state?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Please provide the company state",
    });
  }
  if (!country?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Please provide the company country",
    });
  }
  if (!pincode?.trim()) {
    return response.status(400).json({
      success: false,
      message: "Please provide the company pincode",
    });
  }
  if (!phoneValidator(phone?.trim())) {
    return response.status(400).json({
      success: false,
      message: "Please provide a valid phone/mobile number",
    });
  }
  if (!emailValidator(email?.trim())) {
    return response.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }
  next();
};
