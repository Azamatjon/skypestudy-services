import { performance } from 'perf_hooks';

export const measureRunTime = async (fn: () => void) => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};
