import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import { Form, Formik, Field } from "formik";
import { useRouter } from "next/dist/client/router";
import { createRoomValidation } from "utils/yup";
import { Modal } from "./Modal";
import EVENTS from "utils/events";
import { CreateRoomProps } from "models";

export const NewRoomModal = () => {
  const router = useRouter();
  const { createRoom } = useGame();
  const { user } = useUser();

  const initialValues: CreateRoomProps = {
    name: "",
    password: "",
    withPass: false,
  };

  return (
    <Modal
      button={<button className="buttonStyle1">Crear una sala</button>}
      content={
        <div className="flex flex-col items-center justify-center rounded-md bg-white min-h-[40vh] p-4">
          <h1>Crea una sala</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={createRoomValidation}
            onSubmit={async (values) => await createRoom(values)}
          >
            {({ handleChange, errors, values }) => (
              <Form className="flex flex-col space-y-3">
                <Field
                  name="name"
                  onChange={handleChange}
                  className={`border border-gray-300 p-2 rounded-lg ${
                    !errors ? "mb-5" : "my-2"
                  }`}
                />
                {errors.name && <p>{errors.name}</p>}

                {values.withPass ? (
                  <>
                    <Field
                      name="password"
                      onChange={handleChange}
                      className={`border border-gray-300 p-2 rounded-lg ${
                        !errors ? "mb-5" : "my-2"
                      }`}
                    />
                    {errors.password && <p>{errors.password}</p>}
                  </>
                ) : null}
                <p>with pass?</p>
                <Field
                  type="checkbox"
                  name="withPass"
                  onChange={handleChange}
                />

                <button type="submit">Crear sala</button>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );
};
