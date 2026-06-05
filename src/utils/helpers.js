/**
 * asyncHandler — wraps async route handlers to catch
 * thrown errors and forward to Express error middleware.
 * Eliminates repetitive try/catch in every controller.
 *
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * getPaginationParams — extracts and validates page/limit
 * from query string with sensible defaults.
 *
 * @returns {{ page, limit, skip }}
 */
const getPaginationParams = (query) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * buildPaginationMeta — constructs pagination metadata for responses.
 *
 * @param {number} total   - Total documents matching query
 * @param {number} page    - Current page
 * @param {number} limit   - Items per page
 * @returns {Object} pagination meta
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

/**
 * buildSortOptions — maps a "field:direction" query param
 * into a Mongoose sort object.
 *
 * @param {string} sortQuery  e.g. "createdAt:desc"
 * @param {string} defaultSort  Fallback sort field
 */
const buildSortOptions = (sortQuery, defaultSort = '-createdAt') => {
  if (!sortQuery) return defaultSort;
  const [field, dir] = sortQuery.split(':');
  const direction = dir === 'asc' ? 1 : -1;
  return { [field]: direction };
};

module.exports = { asyncHandler, getPaginationParams, buildPaginationMeta, buildSortOptions };
