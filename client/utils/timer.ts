export const startTimer = () => {
  let timer = 0;
  const interval = setInterval(() => {
    timer += 0.1;

    if (timer >= 10) {
      clearInterval(interval);
    }
  }, 100);

 
  return timer;
};
