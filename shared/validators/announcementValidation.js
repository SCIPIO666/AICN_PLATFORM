const { z } = require('zod');
const { AnnouncementAudienceValues } = require('../constants/enums');

// Create announcement validation
const createAnnouncementSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  body: z.string()
    .min(10, 'Announcement body must be at least 10 characters')
    .max(5000, 'Announcement body must not exceed 5000 characters'),
  
  audience: z.enum(AnnouncementAudienceValues).default('all')
});

// Update announcement validation
const updateAnnouncementSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  
  body: z.string()
    .min(10, 'Announcement body must be at least 10 characters')
    .max(5000, 'Announcement body must not exceed 5000 characters')
    .optional(),
  
  audience: z.enum(AnnouncementAudienceValues).optional()
});

// Announcement filters validation
const announcementFiltersSchema = z.object({
  audience: z.enum(AnnouncementAudienceValues).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional()
});

module.exports = {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementFiltersSchema
};