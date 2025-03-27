import * as yup from "yup";

export const initialLoginValues = {
  Email: "",
  PasswordHash: "",
};

export const loginValidationSchema = yup.object({
  Email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  PasswordHash: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .max(20, "Password should be of maximum 20 characters length")
    .matches(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    )
    .required("Password is required"),
});
