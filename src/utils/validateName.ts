export const validateName = (name: string): boolean => {
  const words = name
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);

  if (words.length < 2) {
    return false;
  }

  return words.every((word) => word.length >= 3);
};
