const trainersModel = require('./trainersModel');
const { sendTrainerApplicationEmail, sendTrainerApprovalEmail } = require('../../utils/emailService');
const logger = require('../../utils/logger');

async function applyForTrainer(userId, data) {
  // if user already has an application
  const existing = await trainersModel.checkExistingApplication(userId);
  if (existing) {
    throw new Error('You already have a trainer application');
  }
  
  if (!data.skills || data.skills.length === 0) {
    throw new Error('At least one skill is required');
  }
  
  // create profile
  const profile = await trainersModel.createTrainerProfile(userId, data);
  
  // Send email notification to admins - later implementation
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

  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) {
    throw new Error('No trainer profile found');
  }
  
  //  if application approved
  if (profile.status === 'APPROVED') {
    throw new Error('Approved applications cannot be modified. Please contact admin.');
  }
  
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

async function getTrainerApplicationById(id, role) {
  if (role !== 'ADMIN') {
    throw new Error('Access denied. Admin only.');
  }
  
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  return profile;
}

async function approveTrainerApplication(id, role) {

    if(role!=='ADMIN'){
        throw new Error('only an Admin can approve trainers')
    }
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Application already approved');
  }
  
  // status to APPROVED /also updates user role via transaction
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
  
  // delete the application and demote user
  const deleted = await trainersModel.deleteTrainerProfile(id, adminId);
  
  return { message: 'Trainer application deleted successfully' };
}

async function getTrainerSessions(userId, role, filters = {}) {
  if (role !== 'ADMIN' && role !== 'TRAINER') {
    throw new Error('Access denied');
  }
  
  const where = {};
  
  if (role === 'TRAINER') {
    where.trainerId = userId;
  }
  
  if (filters.status) where.status = filters.status;
  if (filters.fromDate) where.date = { gte: new Date(filters.fromDate) };
  if (filters.toDate) where.date = { lte: new Date(filters.toDate) };
  
  const sessions = await prisma.session.findMany({
    where,
    include: {
      enrolments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      _count: {
        select: { enrolments: true }
      }
    },
    orderBy: { date: 'asc' }
  });
  
  return sessions;
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
  deleteTrainerApplication,
    getTrainerSessions
};