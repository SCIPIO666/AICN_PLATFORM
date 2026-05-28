const trainersModel = require('./trainersModel');
const prisma = require('../../config/db'); // Add if using Prisma
// const { sendTrainerApplicationEmail, sendTrainerApprovalEmail } = require('../../utils/emailService');
const logger = require('../../utils/logger');

async function applyForTrainer(userId, data) {
  const existing = await trainersModel.checkExistingApplication(userId);
  if (existing) {
    throw new Error('You already have a trainer application');
  }
  
  if (!data.skills || data.skills.length === 0) {
    throw new Error('At least one skill is required');
  }
  
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
  
  // if application already approved
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

async function getTrainerApplicationById(id, userId, role) {
  if (role !== 'ADMIN') {
    throw new Error('Access denied. Admin only.');
  }
  
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  return profile;
}

async function approveTrainerApplication(id, adminId, message = null) {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }
  
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Application already approved');
  }
  
  // Update status to APPROVED and update user role via transaction
  const updated = await trainersModel.updateTrainerStatus(id, 'APPROVED');
  
  // Send approval email
  // await sendTrainerApprovalEmail(profile.user.email, profile.user.name, message);
  
  return updated;
}

async function rejectTrainerApplication(id, adminId, options = {}) {
  const { reason, feedback } = options;
  
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  if (profile.status === 'APPROVED') {
    throw new Error('Cannot reject an already approved application');
  }
  
  // Update status to REJECTED
  const updated = await trainersModel.updateTrainerStatus(id, 'REJECTED');
  
  // Send rejection email with reason
  // await sendTrainerRejectionEmail(profile.user.email, profile.user.name, { reason, feedback });
  
  return updated;
}

async function deleteTrainerApplication(id, adminId) {
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) {
    throw new Error('Trainer application not found');
  }
  
  // Delete the application and demote user
  const deleted = await trainersModel.deleteTrainerProfile(id, adminId);
  
  return { message: 'Trainer application deleted successfully' };
}

async function getTrainerSessions(userId, role, filters = {}) {
  if (role !== 'ADMIN' && role !== 'TRAINER') {
    throw new Error('Access denied');
  }
  
  const prisma = require('../../config/db');
  const where = {};
  
  if (role === 'TRAINER') {
    // Get trainer profile ID first
    const trainerProfile = await trainersModel.getTrainerProfileByUserId(userId);
    if (!trainerProfile) {
      throw new Error('Trainer profile not found');
    }
    where.trainerId = trainerProfile.id;
  }
  
  if (filters.status) where.status = filters.status;
  if (filters.fromDate) where.date = { gte: new Date(filters.fromDate) };
  if (filters.toDate) where.date = { lte: new Date(filters.toDate) };
  
  // Get page and limit from filters
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
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
      skip,
      take: limit,
      orderBy: { date: 'asc' }
    }),
    prisma.session.count({ where })
  ]);
  
  return {
    sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get approved trainers (public information only)
 * @param {Object} filters - Filter options (skill, search)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Paginated list of approved trainers
 */
async function getApprovedTrainers(filters = {}, page = 1, limit = 10) {
  try {
    const prisma = require('../../config/db');
    const skip = (page - 1) * limit;
    
    
    const where = {
      status: 'APPROVED'
    };
    
    
    if (filters.skill) {
      where.skills = {
        hasSome: [filters.skill]
      };
    }
    
    
    if (filters.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { bio: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    
    const total = await prisma.trainerProfile.count({ where });
    
    
    const trainers = await prisma.trainerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        },
        _count: {
          select: {
            sessions: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });
    
   
    const formattedTrainers = trainers.map(trainer => ({
      id: trainer.id,
      userId: trainer.user.id,
      name: trainer.user.name,
      profilePicture: trainer.user.profilePicture || null,
      skills: trainer.skills || [],
      bio: trainer.bio || null,
      availability: trainer.availability || null,
      totalCompletedSessions: trainer._count.sessions,
      joinedAt: trainer.createdAt
    }));
    
    return {
      trainers: formattedTrainers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Failed to get approved trainers: ${error.message}`);
    throw new Error('Unable to fetch approved trainers');
  }
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
  getTrainerSessions,
  getApprovedTrainers  
};