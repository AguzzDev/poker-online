import { Field, useField } from "formik";

export const InputField = (props) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <Field
        {...field}
        {...props}
        autoComplete="off"
        className={`border border-gray-300 p-2 rounded-lg ${
          !meta.error ? "mb-5" : "my-2"
        }`}
      />
      {meta.error && <p className="text-xs text-red-500">{meta.error}</p>}
    </div>
  );
};
