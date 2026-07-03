
class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = { success: true, message };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
  }
  
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination
    });
  }
  
  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }
  
  static noContent(res, message = 'Resource deleted successfully') {
    return res.status(204).json({ success: true, message });
  }
}

module.exports = ApiResponse;