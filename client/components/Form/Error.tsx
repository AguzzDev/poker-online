export const Error = ({ error }: { error: string | undefined }) => (
  <>{error ? <p className="text-red-500">{error}</p> : <></>}</>
);
