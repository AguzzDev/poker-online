import * as Yup from "yup"

export const loginValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
})
export const registerValidation = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
})
export const createRoomValidation = Yup.object().shape({
  username: Yup.string().min(2, "asd"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
})
