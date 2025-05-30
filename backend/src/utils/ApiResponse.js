class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    if (data) {
      this.data = data;
    }
  }
}

export { ApiResponse };
