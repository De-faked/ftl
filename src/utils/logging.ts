export const logDevError = (label: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(label, error);
  }
};
