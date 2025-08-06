import * as Yup from "yup";
import { v4 as uuid } from "uuid";

export const initialCakeValues = {
  CakeName: "",
  CakeDescription: "",
  CategoryId: "",
  CakeImages: [],
  CakeOptions: [
    { id: uuid(), name: "Small", price: 100 },
    { id: uuid(), name: "Large", price: 200 },
  ],
  UserId: "",
  IsPromoted: false,
  IsAvailable: true,
};

export const cakeValidationSchema = Yup.object({
  CakeName: Yup.string().required("Required."),
  CakeDescription: Yup.string().required("Required."),
  CategoryId: Yup.string().required("Required."),
  CakeImages: Yup.array().min(1, "Required."),
  CakeOptions: Yup.array()
    .min(1, "Required.")
    .of(
      Yup.object({
        name: Yup.string().required("Required."),
        price: Yup.number()
          .required("Required.")
          .test(
            "is-decimal",
            "Price must have at most 2 decimal places.",
            (value) => (value + "").match(/^\d+(\.\d{1,2})?$/),
          ),
      }),
    ),
  UserId: Yup.string().required("Required."),
  IsPromoted: Yup.boolean(),
  IsAvailable: Yup.boolean(),
});
