import * as yup from "yup";

export const initialRegisterValues = {
  Email: "",
  Username: "",
  PhoneNumber: "",
  PasswordHash: "",
  confirmPassword: "",
};

export const registerValidationSchema = yup.object({
  Email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  Username: yup
    .string()
    .min(3, "Name should be at least 2 characters")
    .max(20, "Name can not be longer than 20 characters")
    .required("Nickname is required"),
  PhoneNumber: yup
    .string()
    .matches(
      /^(\+64|0)[2-9]\d{7,9}$/,
      "Phone number must begin with +64 or 0 and be between 9 and 11 digits long",
    )
    .required("Phone number is required"),
  PasswordHash: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .max(20, "Password should be of maximum 20 characters length")
    .matches(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("PasswordHash")], "Passwords doesn't match")
    .required("Enter your password again"),
});
