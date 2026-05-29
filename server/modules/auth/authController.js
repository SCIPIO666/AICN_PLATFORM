// auth/authController.js
const authService = require('./authService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, county, role } = req.body;
  const user = await authService.signup(name, email, password, phone, county, role);
  
  return ApiResponse.created(res, {
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  }, 'User registered successfully. Please check your email for confirmation.');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return ApiResponse.success(res, result, 'Login successful');
});

const signout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const result = await authService.signout(token, req.user?.id);
  return ApiResponse.success(res, null, result.message);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user.id);
  return ApiResponse.success(res, { user }, 'User retrieved successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return ApiResponse.success(res, null, result.message);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  return ApiResponse.success(res, null, result.message);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
  return ApiResponse.success(res, null, result.message);
});

const refreshToken = asyncHandler(async (req, res) => {
  let token = req.body.token || req.headers.authorization?.split(' ')[1];
  const result = await authService.refreshToken(token);
  return ApiResponse.success(res, result, 'Token refreshed successfully');
});

module.exports = { signup, login, signout, me, forgotPassword, resetPassword, changePassword, refreshToken };