const {prisma }= require('../../config/db');
const logger = require('../../utils/logger');

async function getStats() {
  try {
    const [totalLearners, totalTrainers, totalSessions, totalCertificates, pendingTrainers] = await Promise.all([
      prisma.user.count({ where: { role: 'LEARNER', deletedAt: null } }),
      prisma.user.count({ where: { role: 'TRAINER', deletedAt: null } }),
      prisma.session.count(),
      prisma.certificate.count({ where: { revokedAt: null } }),
      prisma.trainerProfile.count({ where: { status: 'PENDING' } })
    ]);
    
    return {
      learners: totalLearners,
      trainers: totalTrainers,
      sessions: totalSessions,
      certificates: totalCertificates,
      pendingTrainerApplications: pendingTrainers
    };
  } catch (error) {
    logger.error(`Failed to get stats: ${error.message}`);
    throw error;
  }
}

async function getAllUsers(filters = {}, skip = 0, take = 10) {
  try {
    const where = { deletedAt: null };
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          county: true,
          role: true,
          createdAt: true,
          trainerProfile: {
            select: { status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);
    
    return { users, total };
  } catch (error) {
    logger.error(`Failed to get users: ${error.message}`);
    throw error;
  }
}

async function updateUserRole(userId, newRole) {
  try {

    if (newRole !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN', deletedAt: null } });
      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      
      if (targetUser?.role === 'ADMIN' && adminCount === 1) {
        throw new Error('Cannot demote the last admin user');
      }
    }
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (newRole === 'LEARNER') {
      await prisma.trainerProfile.updateMany({
        where: { userId },
        data: { status: 'REJECTED' }
      });
    }//revoke approval status
    
    return updated;
  } catch (error) {
    logger.error(`Failed to update user role: ${error.message}`);
    throw error;
  }
}

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole
};