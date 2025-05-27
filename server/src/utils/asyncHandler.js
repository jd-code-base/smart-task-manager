import ApiError from './apiError.js';

const asyncHandler = (fn) =>
  function asyncMiddlewareWrapper(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Original Error]', error);
      }

      if (!(error instanceof ApiError)) {
        error = new ApiError(500, error.message || 'Internal Server Error', [error]);
      }

      next(error);
    });
  };

export default asyncHandler;
