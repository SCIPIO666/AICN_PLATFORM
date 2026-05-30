
const {prisma }= require('../../config/db');
const logger = require('../../utils/logger');

async function createTrainerProfile(userId, data) {
  try {
    return await prisma.trainerProfile.create({
      data: { userId, bio: data.bio, skills: data.skills, availability: data.availability, motivation: data.motivation, status: 'PENDING' },
      include: { user: { select: { id: true, name: true, email: true, phone: true, county: true } } }
    });
  } catch (error) {
    logger.error(`Failed to create trainer profile: ${error.message}`);
    throw error;
  }
}

async function getTrainerProfileByUserId(userId) {
  try {
    return await prisma.trainerProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true, phone: true, county: true, createdAt: true } } }
    });
  } catch (error) {
    logger.error(`Failed to get trainer profile by user ID: ${error.message}`);
    throw error;
  }
}

async function getTrainerProfileById(id) {
  try {
    return await prisma.trainerProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true, phone: true, county: true, role: true } } }
    });
  } catch (error) {
    logger.error(`Failed to get trainer profile by ID: ${error.message}`);
    throw error;
  }
}

async function getAllTrainerProfiles(filters = {}, skip = 0, take = 10) {
  try {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.skill) where.skills = { hasSome: [filters.skill] };
    if (filters.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { bio: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    const [profiles, total] = await Promise.all([
      prisma.trainerProfile.findMany({
        where, skip, take,
        include: { user: { select: { id: true, name: true, email: true, county: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.trainerProfile.count({ where })
    ]);
    
    return { profiles, total };
  } catch (error) {
    logger.error(`Failed to get all trainer profiles: ${error.message}`);
    throw error;
  }
}

async function updateTrainerProfile(id, data) {
  try {
    return await prisma.trainerProfile.update({
      where: { id },
      data: { bio: data.bio, skills: data.skills, availability: data.availability, motivation: data.motivation },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
  } catch (error) {
    logger.error(`Failed to update trainer profile: ${error.message}`);
    throw error;
  }
}

async function updateTrainerStatus(id, status) {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updatedProfile = await prisma.trainerProfile.update({ where: { id }, data: { status }, include: { user: true } });
      if (status === 'APPROVED') await prisma.user.update({ where: { id: updatedProfile.userId }, data: { role: 'TRAINER' } });
      if (status === 'REJECTED') await prisma.user.update({ where: { id: updatedProfile.userId }, data: { role: 'LEARNER' } });
      return updatedProfile;
    });
  } catch (error) {
    logger.error(`Failed to update trainer status: ${error.message}`);
    throw error;
  }
}

async function deleteTrainerProfile(id, adminId) {
  try {
    return await prisma.$transaction(async (prisma) => {
      const profile = await prisma.trainerProfile.findUnique({ where: { id }, include: { user: true } });
      if (!profile) throw new Error('Trainer profile not found');
      const deletedProfile = await prisma.trainerProfile.delete({ where: { id } });
      await prisma.user.update({ where: { id: profile.userId }, data: { role: 'LEARNER' } });
      return deletedProfile;
    });
  } catch (error) {
    logger.error(`Failed to delete trainer profile: ${error.message}`);
    throw error;
  }
}

async function checkExistingApplication(userId) {
  try {
    return await prisma.trainerProfile.findUnique({ where: { userId } });
  } catch (error) {
    logger.error(`Failed to check existing application: ${error.message}`);
    throw error;
  }
}

module.exports = { createTrainerProfile, getTrainerProfileByUserId, getTrainerProfileById, getAllTrainerProfiles, updateTrainerProfile, updateTrainerStatus, deleteTrainerProfile, checkExistingApplication };