export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const hashPassword = (password: string): string => {
  let hash = 2166136261;

  for (let index = 0; index < password.length; index += 1) {
    hash ^= password.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `mock_${(hash >>> 0).toString(16)}`;
};

export const waitForMockNetwork = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 350);
  });
};
