import { Link, useNavigate } from "react-router-dom";
import {
  initialRegisterValues,
  registerValidationSchema,
} from "../models/registerValidationSchema";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const Register = () => {
  const navigate = useNavigate();
  const useAuth = useContext(AuthContext);
  const { register } = useAuth;

  const [errorMessage, setErrorMessage] = useState("");

  const className =
    "px-2 focus:ring-opacity-50 h-8 rounded-sm border border-gray-300 transition-all duration-200 focus:border-blue-500 focus:outline-none text-gray-700 font-normal";

  const handleSubmit = async (values, { setSubmitting }) => {
    const userValues = { ...values };
    delete userValues.confirmPassword;

    const result = await register(userValues);
    console.log(result);
    if (result.success) {
      navigate("/");
    } else {
      setErrorMessage(result.message);
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialRegisterValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="mx-auto my-10 max-w-[300px] px-3 text-sm font-semibold text-gray-500 sm:max-w-[400px]">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="Email">Your Email*</label>
              <Field name="Email" type="email" className={className} />
              <ErrorMessage
                name="Email"
                component="div"
                className="text-xs font-normal text-red-500"
              />
              {errorMessage && (
                <div className="text-xs font-normal text-red-500">
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="Username">Your Name*</label>
              <Field name="Username" className={className} />
              <ErrorMessage
                name="Username"
                component="div"
                className="text-xs font-normal text-red-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="PhoneNumber">Phone Number*</label>
              <Field name="PhoneNumber" className={className} />
              <ErrorMessage
                name="PhoneNumber"
                component="div"
                className="text-xs font-normal text-red-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="PasswordHash">Password*</label>
              <Field
                name="PasswordHash"
                type="password"
                className={className}
              />
              <ErrorMessage
                name="PasswordHash"
                component="div"
                className="text-xs font-normal text-red-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <Field
                type="password"
                name="confirmPassword"
                className={className}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-xs font-normal text-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-8 rounded-sm bg-amber-500 text-white transition-all duration-200 hover:cursor-pointer hover:bg-amber-600"
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
            <Link
              className="text-center font-normal text-blue-500 hover:text-blue-600"
              to="/login"
            >
              Already have an account? Login
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default Register;
