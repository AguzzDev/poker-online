import { useGame } from "context/Game/GameProvider";
import { Formik } from "formik";
import { createRoomValidation } from "utils/yup";
import { CreateRoomInput } from "models";
import { Form } from "components/Form/Form";
import { options } from "utils/buyInOptions";

export const NewRoom = () => {
  const { createRoom } = useGame();

  const inputs = [
    { name: "name" },
    {
      name: "buyIn",
      type: "select",
      options,
    },
  ];

  const initialValues: CreateRoomInput = {
    name: "",
    buyIn: "10000",
    global: "",
  };

  return (
    <div className="flex-col items-center justify-center w-full h-full">
      <h3>Create your Room</h3>

      <div className="mt-5">
        <Formik
          initialValues={initialValues}
          validationSchema={createRoomValidation}
          onSubmit={async (values) => {
            await createRoom(values);
          }}
        >
          {(props) => (
            <Form
              resetForm={props.resetForm}
              errors={props.errors.global}
              inputs={inputs}
              buttonText="Create Room"
            />
          )}
        </Formik>
      </div>
    </div>
  );
};
