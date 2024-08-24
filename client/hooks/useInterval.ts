import { useEffect, useState } from "react";

export const useInterval = (initialTimer: number) => {
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTimer]);

  return { timer };
};
