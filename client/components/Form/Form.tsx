import { ButtonOne } from "components/Button/ButtonOne";
import { InputField } from "./InputField";
import { Form as FormFormik } from "formik";
import { FormProps } from "models";
import { Error } from "./Error";

export const Form = (props: FormProps) => {
  const { errors, resetForm, actionButton, inputs, buttonText } = props;

  const ActionButton = ({
    title,
    action,
    text,
  }: {
    title: string;
    action: Function;
    text: string;
  }) => (
    <div className="flex space-x-3">
      <h6>{title}</h6>
      <button
        className="font-bold hover:text-primary hover:opacity-90"
        onClick={() => {
          resetForm();
          action();
        }}
      >
        <p>{text}</p>
      </button>
    </div>
  );

  return (
    <FormFormik className="flex flex-col space-y-4 md:space-y-8">
      {inputs.map((item, i) => (
        <InputField
          key={i}
          name={item.name}
          type={item.type || "text"}
          options={item.options}
          placeholder={
            item.name === "password2"
              ? item.name.slice(0, 1).toUpperCase() + item.name.slice(1, -1)
              : item.name.slice(0, 1).toUpperCase() + item.name.slice(1)
          }
        />
      ))}

      <Error error={errors} />

      <ButtonOne type="submit">{buttonText}</ButtonOne>

      <div className="flex-col space-y-1">
        {actionButton?.map((item, i) => (
          <ActionButton key={i} {...item} />
        ))}
      </div>
    </FormFormik>
  );
};
