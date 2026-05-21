const trainersModel = require('./trainersModel');
const { sendTrainerApplicationEmail, sendTrainerApprovalEmail } = require('../../utils/emailService');
const logger = require('../../utils/logger');

async function applyForTrainer(userId, data) {
  // Check if user already has an application
  const existing = await trainersModel.checkExistingApplication(userId);
  if (existing) {
    throw new Error('You already have a trainer application');
  }
  
  // Validate skills array
  if (!data.skills || data.skills.length === 0) {
    throw new Error('At least one skill is required');
  }
  
  // Create trainer profile
  const profile = await trainersModel.createTrainerProfile(userId, data);
  
  // Send email notification to admins (optional - implement if needed)
  // await sendTrainerApplicationEmail(profile);
  
  return profile;
}

async function getMyTrainerProfile(userId) {
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) {
    throw new Error('No trainer profile found');
  }
  return profile;
}

async function updateMyTrainerProfile(userId, updateData) {
  // Get existing profile
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) {
    throw new Error('No trainer profile found');
  }
  
  // Check if application is already approved
  if (profile.status === 'APPROVED') {
    throw new Error('Approved applications cannot be modified. Please contact admin.');
  }
  
  // Update profile
  const updated = await trainersModel.updateTrainerProfile(profile.id, updateData);
  return updated;
}

async function withdrawApplication(userId) {
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) {
    throw new Error('No trainer application found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Cannot withdraw an approved application');
  }
  
  // Delete the application
  await trainersModel.deleteTrainerProfile(profile.id, userId);
  
  return { message: 'Application withdrawn successfully' };
}

async function getAllTrainerApplications(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const { profiles, total } = await trainersModel.getAllTrainerProfiles(filters, skip, limit);
  
  return {
    data: profiles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function getTrainerApplicationById(id, adminId, adminRole) {
  if (adminRole !== 'ADMIN') {
    throw new Error('Access denied. Admin only.');
  }
  
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  return profile;
}

async function approveTrainerApplication(id, adminId) {
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Application already approved');
  }
  
  // Update status to APPROVED (this also updates user role via transaction)
  const updated = await trainersModel.updateTrainerStatus(id, 'APPROVED');
  
  // Send approval email
  await sendTrainerApprovalEmail(profile.user.email, profile.user.name);
  
  return updated;
}

async function rejectTrainerApplication(id, adminId) {
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Cannot reject an already approved application');
  }
  
  // Update status to REJECTED
  const updated = await trainersModel.updateTrainerStatus(id, 'REJECTED');
  
  return updated;
}

async function deleteTrainerApplication(id, adminId) {
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  // Hard delete the application and demote user
  const deleted = await trainersModel.deleteTrainerProfile(id, adminId);
  
  return { message: 'Trainer application deleted successfully' };
}

module.exports = {
  applyForTrainer,
  getMyTrainerProfile,
  updateMyTrainerProfile,
  withdrawApplication,
  getAllTrainerApplications,
  getTrainerApplicationById,
  approveTrainerApplication,
  rejectTrainerApplication,
  deleteTrainerApplication
};