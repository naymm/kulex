export function isValidPassword(password: string) {
  if (password.length < 9) return false;
  return /[A-Za-z]/.test(password) && /\d/.test(password);
}
