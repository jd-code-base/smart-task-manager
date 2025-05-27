import CONFIG from '../config/config.js';
import ApiError from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  try {
    if (res.headersSent) {
      return next(err);
    }

    if (!(err instanceof ApiError)) {
      err = new ApiError(500, err.message || 'Internal Server Error', [err]);
    }

    if (CONFIG.NODE_ENV === 'development') {
      console.error('[ErrorHandler]', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        ...(CONFIG.LOG_REQUEST_BODY && { body: req.body }),
      });
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      data: err.data || null,
      errorId: err.errorId,
      timestamp: err.timestamp,
      ...(CONFIG.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } catch (fatal) {
    console.error('[Fatal Error in errorHandler]', fatal);
    return res.status(500).json({
      success: false,
      message: 'Unhandled error in error handler',
    });
  }
};

export default errorHandler;
