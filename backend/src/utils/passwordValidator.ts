export interface PasswordRuleStatus {
  minLength: boolean;
  startsWithCapital: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noSpaces: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  rules: PasswordRuleStatus;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required'],
      rules: {
        minLength: false,
        startsWithCapital: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        noSpaces: false,
      },
    };
  }

  const minLength = password.length >= 8;
  const startsWithCapital = /^[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const noSpaces = !/\s/.test(password);

  const errors: string[] = [];
  if (!minLength) errors.push('Password must be at least 8 characters');
  if (!startsWithCapital) errors.push('Password must start with an uppercase letter (A-Z)');
  if (!hasLowercase) errors.push('Password must contain at least one lowercase letter (a-z)');
  if (!hasNumber) errors.push('Password must contain at least one number (0-9)');
  if (!hasSpecial) errors.push('Password must contain at least one special symbol (!@#$%^&*)');
  if (!noSpaces) errors.push('Password must not contain spaces');

  const isValid = minLength && startsWithCapital && hasLowercase && hasNumber && hasSpecial && noSpaces;

  return {
    isValid,
    errors,
    rules: {
      minLength,
      startsWithCapital,
      hasLowercase,
      hasNumber,
      hasSpecial,
      noSpaces,
    },
  };
};

