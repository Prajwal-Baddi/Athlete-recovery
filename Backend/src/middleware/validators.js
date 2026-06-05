const { validationResult, body, param, query } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * validate — runs express-validator results and short-circuits
 * the request with a 422 if any validation failed.
 * Place AFTER the validation chain in the route.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field:   e.path || e.param,
      message: e.msg,
    }));
    return sendError(res, 'Validation failed', 422, formatted);
  }
  next();
};

// ─── Auth validators ─────────────────────────────────────────────────────────

const registerValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['athlete', 'physiotherapist', 'coach'])
    .withMessage('Role must be athlete, physiotherapist, or coach'),
];

const loginValidators = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const changePasswordValidators = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase and a number'),
];

// ─── Athlete profile validators ───────────────────────────────────────────────

const athleteProfileValidators = [
  body('sport')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Sport name too long'),

  body('team')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Team name too long'),

  body('age')
    .optional()
    .isInt({ min: 10, max: 100 }).withMessage('Age must be between 10 and 100'),

  body('height')
    .optional()
    .isFloat({ min: 0 }).withMessage('Height must be a positive number (cm)'),

  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight must be a positive number (kg)'),

  body('recoveryStatus')
    .optional()
    .isIn(['active', 'recovering', 'injured', 'resting', 'cleared'])
    .withMessage('Invalid recovery status'),
];

const addInjuryValidators = [
  body('bodyPart')
    .trim()
    .notEmpty().withMessage('Body part is required'),

  body('severity')
    .optional()
    .isIn(['minor', 'moderate', 'severe']).withMessage('Invalid severity'),

  body('dateOccurred')
    .optional()
    .isISO8601().withMessage('dateOccurred must be a valid date'),
];

// ─── Shared validators ────────────────────────────────────────────────────────

const mongoIdParam = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`${paramName} must be a valid ID`),
];

const paginationValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  changePasswordValidators,
  athleteProfileValidators,
  addInjuryValidators,
  mongoIdParam,
  paginationValidators,
};
