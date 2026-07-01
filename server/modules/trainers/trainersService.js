const trainersModel = require('./trainersModel');
const { prisma } = require('../../config/db');
const logger = require('../../utils/logger');
const { NotFoundError, BusinessLogicError, AuthorizationError } = require('../../utils/errors/customErrors');
const {
  sendTrainerApprovalEmail,
  sendTrainerApplicationReceivedEmail,
} = require('../../utils/email/email services/aicnEmailsService');

async function applyForTrainer(userId, data) {
  const existing = await trainersModel.checkExistingApplication(userId);
  if (existing) {
    throw new BusinessLogicError('You already have a trainer application');
  }
  if (!data.skills || data.skills.length === 0) {
    throw new BusinessLogicError('At least one skill is required');
  }

  const profile = await trainersModel.createTrainerProfile(userId, data);

  // Fetch user so we can email them
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true }
  });

  if (user) {
    sendTrainerApplicationReceivedEmail({
      to: user.email,
      name: user.name,
    }).catch(err => logger.error(`Failed to send trainer application receipt email: ${err.message}`));
  }

  return profile;
}

async function getMyTrainerProfile(userId) {
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) throw new NotFoundError('Trainer profile');
  return profile;
}

async function updateMyTrainerProfile(userId, updateData) {
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) throw new NotFoundError('Trainer profile');
  if (profile.status === 'APPROVED') {
    throw new BusinessLogicError('Approved applications cannot be modified. Please contact admin.');
  }
  return await trainersModel.updateTrainerProfile(profile.id, updateData);
}

async function withdrawApplication(userId) {
  const profile = await trainersModel.getTrainerProfileByUserId(userId);
  if (!profile) throw new NotFoundError('Trainer application');
  if (profile.status === 'APPROVED') {
    throw new BusinessLogicError('Cannot withdraw an approved application');
  }
  await trainersModel.deleteTrainerProfile(profile.id, userId);
  return { message: 'Application withdrawn successfully' };
}

async function getAllTrainerApplications(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const { profiles, total } = await trainersModel.getAllTrainerProfiles(filters, skip, limit);
  return {
    applications: profiles,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
}

async function getTrainerApplicationById(id, userId, role) {
  if (role !== 'ADMIN') throw new AuthorizationError('Access denied. Admin only.');
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) throw new NotFoundError('Trainer application');
  return profile;
}

async function approveTrainerApplication(id, adminId, message = null) {
  if (!adminId) throw new BusinessLogicError('Admin ID is required');

  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) throw new NotFoundError('Trainer application');
  if (profile.status === 'APPROVED') throw new BusinessLogicError('Application already approved');

  const updated = await trainersModel.updateTrainerStatus(id, 'APPROVED');

  // Send approval email
  sendTrainerApprovalEmail({
    to: profile.user.email,
    name: profile.user.name,
    approved: true,
    trainerId: profile.id,
    reason: null,
  }).catch(err => logger.error(`Failed to send trainer approval email: ${err.message}`));

  logger.info(`Trainer application ${id} approved — email sent to ${profile.user.email}`);
  return updated;
}

async function rejectTrainerApplication(id, adminId, options = {}) {
  const { reason, feedback } = options;

  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) throw new NotFoundError('Trainer application');
  if (profile.status === 'APPROVED') throw new BusinessLogicError('Cannot reject an already approved application');

  const updated = await trainersModel.updateTrainerStatus(id, 'REJECTED');

  // Send rejection email
  sendTrainerApprovalEmail({
    to: profile.user.email,
    name: profile.user.name,
    approved: false,
    reason: reason || feedback || null,
    trainerId: null,
  }).catch(err => logger.error(`Failed to send trainer rejection email: ${err.message}`));

  logger.info(`Trainer application ${id} rejected — email sent to ${profile.user.email}`);
  return updated;
}

async function deleteTrainerApplication(id, adminId) {
  const profile = await trainersModel.getTrainerProfileById(id);
  if (!profile) throw new NotFoundError('Trainer application');
  await trainersModel.deleteTrainerProfile(id, adminId);
  return { message: 'Trainer application deleted successfully' };
}

async function getTrainerSessions(userId, role, filters = {}) {
  if (role !== 'ADMIN' && role !== 'TRAINER') {
    throw new AuthorizationError('Access denied');
  }
  const where = {};
  if (role === 'TRAINER') {
    const trainerProfile = await trainersModel.getTrainerProfileByUserId(userId);
    if (!trainerProfile) throw new NotFoundError('Trainer profile');
    where.trainerId = trainerProfile.id;
  }
  if (filters.status) where.status = filters.status;
  if (filters.fromDate) where.date = { gte: new Date(filters.fromDate) };
  if (filters.toDate) where.date = { lte: new Date(filters.toDate) };

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where, skip, take: limit,
      include: {
        enrolments: {
          include: { user: { select: { id: true, name: true, email: true, phone: true } } }
        },
        _count: { select: { enrolments: true } }
      },
      orderBy: { date: 'asc' }
    }),
    prisma.session.count({ where })
  ]);

  return {
    sessions, total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
}

async function getApprovedTrainers(filters = {}, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const where = { status: 'APPROVED' };
    if (filters.skill) where.skills = { hasSome: [filters.skill] };
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
            id: true, name: true, email: true,
            trainedSessions: { where: { status: 'COMPLETED' }, select: { id: true } }
          }
        }
      },
      skip, take: limit, orderBy: { updatedAt: 'desc' }
    });

    const formattedTrainers = trainers.map(trainer => ({
      id: trainer.id,
      userId: trainer.user.id,
      name: trainer.user.name,
      profilePicture: trainer.user.profilePicture || null,
      skills: trainer.skills || [],
      bio: trainer.bio || null,
      availability: trainer.availability || null,
      totalCompletedSessions: trainer.user.trainedSessions.length,
      joinedAt: trainer.createdAt
    }));

    return {
      trainers: formattedTrainers, total,
      page: parseInt(page), limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Failed to get approved trainers: ${error.message}`);
    throw new Error('Unable to fetch approved trainers');
  }
}

module.exports = {
  applyForTrainer, getMyTrainerProfile, updateMyTrainerProfile, withdrawApplication,
  getAllTrainerApplications, getTrainerApplicationById, approveTrainerApplication,
  rejectTrainerApplication, deleteTrainerApplication, getTrainerSessions, getApprovedTrainers
};