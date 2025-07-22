import crypto from 'node:crypto';

// List of common passwords to reject
export const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
  'master', 'shadow', 'football', 'baseball', 'superman', 'hello',
  'sunshine', 'princess', 'iloveyou', '12345678', 'passw0rd'
];

// Generate secure random string
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate cryptographically secure random numbers
export const generateSecureCode = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  // Use crypto.randomInt for secure random number generation
  return crypto.randomInt(min, max + 1).toString();
};

// Check if password is in common passwords list
export const isCommonPassword = (password) => {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
    notCommon: !isCommonPassword(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    isValid: score === 6,
    score,
    checks,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
  };
};

// Hash sensitive data consistently
export const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Generate JWT ID for token tracking
export const generateJwtId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Rate limiting helper - calculate delay based on attempts
export const calculateDelay = (attempts) => {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc., max 30s
  return Math.min(Math.pow(2, attempts - 1) * 1000, 30000);
};

// Secure session ID generation
export const generateSessionId = () => {
  return crypto.randomBytes(32).toString('base64url');
};

export default {
  COMMON_PASSWORDS,
  generateSecureToken,
  generateSecureCode,
  isCommonPassword,
  validatePasswordStrength,
  hashData,
  generateJwtId,
  calculateDelay,
  generateSessionId
};
