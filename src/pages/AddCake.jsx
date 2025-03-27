import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  cakeValidationSchema,
  initialCakeValues,
} from "../models/cakeValidationSchema";
import ImageUploader from "../components/ImageUploader";
import { TiDelete } from "react-icons/ti";
import { FaPlusCircle } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { createCake } from "../services/apiCake";
import { useNavigate } from "react-router-dom";
import CakeContext from "../contexts/CakeContext";

const AddCake = () => {
  const useAuth = useContext(AuthContext);
  const { user, jwt } = useAuth;

  const useCake = useContext(CakeContext);
  const { setCakes, categories } = useCake;

  const navigate = useNavigate();

  initialCakeValues.UserId = user?.id;

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const formData = new FormData();

    formData.append("CakeName", values.CakeName);
    formData.append("CategoryId", values.CategoryId);
    formData.append("CakeDescription", values.CakeDescription);
    formData.append("UserId", values.UserId);
    formData.append("IsPromoted", values.IsPromoted);
    formData.append("IsAvailable", values.IsAvailable);
    formData.append("CakeOptions", JSON.stringify(values.CakeOptions));

    values.CakeImages.forEach((item) => {
      formData.append("CakeImages", item.file);
    });

    const result = await createCake(formData, jwt);

    if (result.success) {
      console.log(result.data);
      setCakes((prev) => [...prev, result.data]);
      navigate("/manage-cake");
    } else {
      console.error("Error creating cake");
    }

    setSubmitting(false);
  };

  return (
    <div className="sm:20 mx-auto px-6 py-4 sm:max-w-6xl sm:py-6 md:px-30">
      <Formik
        initialValues={initialCakeValues}
        validationSchema={cakeValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, isSubmitting, setFieldError }) => (
          <Form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <p className="text-gray-700">Cake Images*</p>
                  <ErrorMessage
                    name="CakeImages"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <ImageUploader values={values} setFieldValue={setFieldValue} />
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
                <label
                  htmlFor="CakeName"
                  className="w-24 flex-shrink-0 text-gray-700"
                >
                  Cake Name*
                </label>
                <Field
                  name="CakeName"
                  className="focus:ring-opacity-50 h-8 w-full rounded-sm border border-gray-300 px-2 font-normal text-gray-700 transition-all duration-200 focus:border-blue-500 focus:outline-none md:w-1/3"
                />
                <ErrorMessage
                  name="CakeName"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
                <label
                  htmlFor="CategoryId"
                  className="w-24 flex-shrink-0 text-gray-700"
                >
                  Category*
                </label>
                <Field
                  name="CategoryId"
                  as="select"
                  className="focus:ring-opacity-50 h-8 w-full rounded-sm border border-gray-300 px-2 font-normal text-gray-700 transition-all duration-200 focus:border-blue-500 focus:outline-none md:w-1/3"
                >
                  <option className="text-red-500" value="">
                    Select Category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="CategoryId"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
                <label
                  htmlFor="CakeDescription"
                  className="w-24 flex-shrink-0 text-gray-700"
                >
                  Description*
                </label>
                <Field
                  name="CakeDescription"
                  as="textarea"
                  rows="4"
                  className="focus:ring-opacity-50 w-full rounded-sm border border-gray-300 px-2 pt-1 font-normal text-gray-700 transition-all duration-100 focus:border-blue-500 focus:outline-none md:w-3/4"
                />
                <ErrorMessage
                  name="CakeDescription"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex sm:gap-12">
                {/* price options */}
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
                  <label
                    htmlFor="CakePrice"
                    className="w-24 flex-shrink-0 text-gray-700"
                  >
                    Cake Price*
                  </label>
                  <div className="flex flex-col gap-2">
                    {values.CakeOptions.map((option, index) => {
                      return (
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <Field
                            name={`CakeOptions[${index}].name`}
                            className="focus:ring-opacity-50 h-8 w-20 rounded-sm border border-gray-300 px-2 font-normal text-gray-700 transition-all duration-100 focus:border-blue-500 focus:outline-none"
                          />
                          <Field
                            name={`CakeOptions[${index}].price`}
                            type="number"
                            className="focus:ring-opacity-50 h-8 w-20 rounded-sm border border-gray-300 px-2 font-normal text-gray-700 transition-all duration-100 focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (values.CakeOptions.length > 1) {
                                setFieldValue(
                                  "CakeOptions",
                                  values.CakeOptions.filter(
                                    (_, idx) => idx !== index,
                                  ),
                                );
                              } else {
                                setFieldError(
                                  "CakeOptions",
                                  "At least one option is required.",
                                );
                              }
                            }}
                          >
                            <TiDelete className="h-7 w-7 text-red-500 transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:opacity-60" />
                          </button>
                          <ErrorMessage
                            name={`CakeOptions[${index}].name`}
                            component="div"
                            className="text-red-500"
                          />
                          <ErrorMessage
                            name={`CakeOptions[${index}].price`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      );
                    })}

                    {/* Add Cake Option */}
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("CakeOptions", [
                          ...values.CakeOptions,
                          { id: uuid(), name: "", price: "" },
                        ])
                      }
                    >
                      <FaPlusCircle className="h-4.5 w-4.5 text-green-700 hover:scale-105 hover:cursor-pointer hover:opacity-60" />
                    </button>
                  </div>
                </div>

                {/* promote and available checkbox */}
                <div className="flex flex-col gap-3 p-7 sm:p-0">
                  <div className="flex items-center gap-3 py-1">
                    <Field
                      name="IsPromoted"
                      type="checkbox"
                      className="h-5 w-5"
                    />
                    <label htmlFor="IsPromoted" className="text-gray-700">
                      Promote
                    </label>
                    <ErrorMessage
                      name="IsPromoted"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Field
                      name="IsAvailable"
                      type="checkbox"
                      className="h-5 w-5"
                    />
                    <label htmlFor="IsAvailable" className="text-gray-700">
                      Available
                    </label>
                    <ErrorMessage
                      name="IsAvailable"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mx-auto my-5 w-1/2 rounded-full bg-amber-400 p-2 text-xl duration-200 hover:cursor-pointer hover:bg-amber-500 hover:text-amber-50"
              >
                {isSubmitting ? "Loading..." : "Add"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCake;
