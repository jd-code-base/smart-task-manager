class ApiResponse {
  constructor(statusCode = 200, message = 'Success', data = {}) {
    if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode >= 600) {
      throw new TypeError(`Invalid statusCode: ${statusCode}. Must be 100–599.`);
    }

    if (typeof message !== 'string') {
      throw new TypeError(`Invalid message: ${message}. Must be a string.`);
    }

    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = this._formatData(data);
    this.timestamp = new Date().toISOString();

    if (process.env.NODE_ENV === 'production') {
      Object.freeze(this);
    }
  }

  _formatData(data) {
    return data !== null && typeof data === 'object' ? data : { result: data };
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      data: this.data,
      timestamp: this.timestamp,
    };
  }

  toString() {
    return `[${this.timestamp}] ApiResponse (${this.statusCode}): ${this.message}`;
  }

  log() {
    console.log(this.toString(), { data: this.data });
  }

  static ok(data = {}, message = 'OK') {
    return new ApiResponse(200, message, data);
  }

  static created(data = {}, message = 'Created') {
    return new ApiResponse(201, message, data);
  }
}

export default ApiResponse;
