// Shared enums extracted from Prisma schema
const Role = {
  LEARNER: 'LEARNER',
  TRAINER: 'TRAINER',
  ADMIN: 'ADMIN'
} as const;

const SessionStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

const LocationType = {
  PHYSICAL: 'PHYSICAL',
  ONLINE: 'ONLINE'
} as const;

const EnrolmentStatus = {
  ENROLLED: 'ENROLLED',
  ATTENDED: 'ATTENDED',
  ABSENT: 'ABSENT',
  CANCELLED: 'CANCELLED'
} as const;

const TrainerStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

const AnnouncementAudience = {
  ALL: 'all',
  LEARNERS: 'learners',
  TRAINERS: 'trainers'
} as const;

// Arrays for validation
const RoleValues = Object.values(Role);
const SessionStatusValues = Object.values(SessionStatus);
const LocationTypeValues = Object.values(LocationType);
const EnrolmentStatusValues = Object.values(EnrolmentStatus);
const TrainerStatusValues = Object.values(TrainerStatus);
const AnnouncementAudienceValues = Object.values(AnnouncementAudience);

module.exports = {
  Role,
  RoleValues,
  SessionStatus,
  SessionStatusValues,
  LocationType,
  LocationTypeValues,
  EnrolmentStatus,
  EnrolmentStatusValues,
  TrainerStatus,
  TrainerStatusValues,
  AnnouncementAudience,
  AnnouncementAudienceValues
};