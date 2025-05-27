import { v4 as uuidv4 } from 'uuid';
import CONFIG from '../config/config.js';

class ApiError extends Error {
  constructor(statusCode, message = 'Internal Server Error', errors = [], data = undefined) {
    if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode >= 600) {
      throw new TypeError(`Invalid statusCode: ${statusCode}. Must be 100-599.`);
    }

    if (typeof message !== 'string') {
      throw new TypeError(`Invalid message: ${message}. Must be a string.`);
    }

    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = this.normalizeErrors(errors);
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.errorId = uuidv4();

    if (CONFIG.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    }

    if (CONFIG.NODE_ENV === 'production') {
      Object.freeze(this);
    }
  }

  normalizeErrors(errors) {
    if (!Array.isArray(errors)) return [];

    return errors.map((err) => {
      if (err instanceof Error) return { message: err.message, stack: err.stack };
      if (typeof err === 'object' && err !== null) return err;
      return { message: String(err) };
    });
  }

  toJSON() {
    return {
      errorId: this.errorId,
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      errors: this.errors,
      data: this.data,
      timestamp: this.timestamp,
    };
  }

  toString() {
    return `[${this.timestamp}] ApiError (${this.statusCode}): ${this.message} | ID: ${this.errorId}`;
  }

  log() {
    console.error(this.toString(), { errors: this.errors, data: this.data });
  }

  static badRequest(message, errors, data) {
    return new ApiError(400, message, errors, data);
  }

  static unauthorized(message, errors, data) {
    return new ApiError(401, message, errors, data);
  }

  static forbidden(message = 'Forbidden', errors = [], data) {
    return new ApiError(403, message, errors, data);
  }

  static notFound(message = 'Resource not found', errors = [], data) {
    return new ApiError(404, message, errors, data);
  }
}

export default ApiError;
