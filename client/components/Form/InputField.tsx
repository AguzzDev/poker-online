import { Field, useField } from "formik";
import { InputFieldProps } from "models";

export const InputField = (props: InputFieldProps) => {
  const [field, meta] = useField(props);

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <div>
      {props.type === "select" ? (
        <Field
          as="select"
          {...field}
          {...props}
          className={`border-b border-border p-2 text-xl md:text-2xl`}
        >
          {props.options?.map((option, i) => (
            <option className="bg-black1" key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      ) : (
        <Field
          {...field}
          {...props}
          onKeyDown={handleEnter}
          autoComplete="off"
          className={`border-b border-border p-2 text-xl md:text-2xl`}
        />
      )}
      {meta.error && <p className="text-red-500 mt-2">{meta.error}</p>}
    </div>
  );
};
