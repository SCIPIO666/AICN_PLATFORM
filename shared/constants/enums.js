// Shared enums extracted from Prisma schema

const Role = {
  LEARNER: 'LEARNER',
  TRAINER: 'TRAINER',
  ADMIN: 'ADMIN'
};

const SessionStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

const LocationType = {
  PHYSICAL: 'PHYSICAL',
  ONLINE: 'ONLINE'
};

const EnrolmentStatus = {
  ENROLLED: 'ENROLLED',
  ATTENDED: 'ATTENDED',
  ABSENT: 'ABSENT',
  CANCELLED: 'CANCELLED'
};

const TrainerStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

const AnnouncementAudience = {
  ALL: 'all',
  LEARNERS: 'learners',
  TRAINERS: 'trainers'
};

// Arrays for validation
const RoleValues = Object.values(Role);
const SessionStatusValues = Object.values(SessionStatus);
const LocationTypeValues = Object.values(LocationType);
const EnrolmentStatusValues = Object.values(EnrolmentStatus);
const TrainerStatusValues = Object.values(TrainerStatus);
const AnnouncementAudienceValues = Object.values(AnnouncementAudience);

module.exports = {
  // Enum objects
  Role,
  SessionStatus,
  LocationType,
  EnrolmentStatus,
  TrainerStatus,
  AnnouncementAudience,
  
  // Value arrays for validation
  RoleValues,
  SessionStatusValues,
  LocationTypeValues,
  EnrolmentStatusValues,
  TrainerStatusValues,
  AnnouncementAudienceValues
};