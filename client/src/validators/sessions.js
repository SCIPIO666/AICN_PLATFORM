
import { isValid, parseISO, isFuture } from 'date-fns';


export const SESSION_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const SESSION_STATUS_VALUES = Object.values(SESSION_STATUS);

export const LOCATION_TYPES = {
  ONLINE: 'ONLINE',
  PHYSICAL: 'PHYSICAL',
};

export const LOCATION_TYPE_VALUES = Object.values(LOCATION_TYPES);

// Skill Areas 
export const SKILL_AREAS = [
  'Data Analysis',
  'Cyber Hygiene', 
  'Digital Marketing',
  'Graphic Design',
  'Soft Skills',
  'Basics in Cyber Security',
  'Content Creation & Monetization',
  'Introduction to Online Jobs',
];


export const sessionValidationRules = {
  title: {
    min: 3,
    max: 200,
    required: true,
    message: {
      min: 'Title must be at least 3 characters',
      max: 'Title must not exceed 200 characters',
      required: 'Session title is required',
    }
  },
  skillArea: {
    min: 2,
    max: 100,
    required: true,
    message: {
      min: 'Skill area must be at least 2 characters',
      max: 'Skill area must not exceed 100 characters',
      required: 'Please select a skill area',
    }
  },
  description: {
    max: 2000,
    required: false,
    message: {
      max: 'Description must not exceed 2000 characters',
    }
  },
  date: {
    required: true,
    message: {
      required: 'Session date and time is required',
      invalid: 'Invalid date format',
      future: 'Session date must be in the future',
    }
  },
  durationMins: {
    min: 30,
    max: 480,
    required: true,
    default: 120,
    message: {
      min: 'Duration must be at least 30 minutes',
      max: 'Duration must not exceed 480 minutes (8 hours)',
      required: 'Duration is required',
      integer: 'Duration must be a whole number',
    }
  },
  capacity: {
    min: 1,
    max: 100,
    required: true,
    default: 30,
    message: {
      min: 'Capacity must be at least 1',
      max: 'Capacity must not exceed 100',
      required: 'Capacity is required',
      integer: 'Capacity must be a whole number',
    }
  },
  venue: {
    min: 3,
    max: 500,
    required: false, // PHYSICAL
    message: {
      min: 'Venue must be at least 3 characters',
      max: 'Venue must not exceed 500 characters',
      required: 'Venue is required for physical sessions',
    }
  },
  meetingLink: {
    required: false, //ONLINE
    message: {
      invalid: 'Must be a valid URL for online sessions',
      required: 'Meeting link is required for online sessions',
    }
  },
  county: {
    min: 2,
    max: 50,
    required: false,
    message: {
      min: 'County must be at least 2 characters',
      max: 'County must not exceed 50 characters',
    }
  },
};


export const validateSession = (formData, isEdit = false) => {
  const errors = {};
  

  if (!formData.title?.trim()) {
    errors.title = sessionValidationRules.title.message.required;
  } else if (formData.title.length < sessionValidationRules.title.min) {
    errors.title = sessionValidationRules.title.message.min;
  } else if (formData.title.length > sessionValidationRules.title.max) {
    errors.title = sessionValidationRules.title.message.max;
  }

  if (!formData.skillArea) {
    errors.skillArea = sessionValidationRules.skillArea.message.required;
  } else if (formData.skillArea.length < sessionValidationRules.skillArea.min) {
    errors.skillArea = sessionValidationRules.skillArea.message.min;
  } else if (formData.skillArea.length > sessionValidationRules.skillArea.max) {
    errors.skillArea = sessionValidationRules.skillArea.message.max;
  }

  if (formData.description && formData.description.length > sessionValidationRules.description.max) {
    errors.description = sessionValidationRules.description.message.max;
  }

  if (!formData.date) {
    errors.date = sessionValidationRules.date.message.required;
  } else {
    try {
      const dateObj = typeof formData.date === 'string' ? parseISO(formData.date) : new Date(formData.date);
      
      if (!isValid(dateObj)) {
        errors.date = sessionValidationRules.date.message.invalid;
      } else if (!isFuture(dateObj) && !isEdit) {
        errors.date = sessionValidationRules.date.message.future;
      }
    } catch {
      errors.date = sessionValidationRules.date.message.invalid;
    }
  }


  const duration = Number(formData.durationMins);
  if (!formData.durationMins || isNaN(duration) || duration <= 0) {
    errors.durationMins = sessionValidationRules.durationMins.message.required;
  } else if (!Number.isInteger(duration)) {
    errors.durationMins = sessionValidationRules.durationMins.message.integer;
  } else if (duration < sessionValidationRules.durationMins.min) {
    errors.durationMins = sessionValidationRules.durationMins.message.min;
  } else if (duration > sessionValidationRules.durationMins.max) {
    errors.durationMins = sessionValidationRules.durationMins.message.max;
  }


  const capacity = Number(formData.capacity);
  if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
    errors.capacity = sessionValidationRules.capacity.message.required;
  } else if (!Number.isInteger(capacity)) {
    errors.capacity = sessionValidationRules.capacity.message.integer;
  } else if (capacity < sessionValidationRules.capacity.min) {
    errors.capacity = sessionValidationRules.capacity.message.min;
  } else if (capacity > sessionValidationRules.capacity.max) {
    errors.capacity = sessionValidationRules.capacity.message.max;
  }

 
  if (formData.locationType === LOCATION_TYPES.PHYSICAL) {
    // Venue is required for PHYSICAL sessions
    if (!formData.venue?.trim()) {
      errors.venue = sessionValidationRules.venue.message.required;
    } else if (formData.venue.length < sessionValidationRules.venue.min) {
      errors.venue = sessionValidationRules.venue.message.min;
    } else if (formData.venue.length > sessionValidationRules.venue.max) {
      errors.venue = sessionValidationRules.venue.message.max;
    }
  } else if (formData.locationType === LOCATION_TYPES.ONLINE) {


    if (!formData.meetingLink?.trim()) {
      errors.meetingLink = sessionValidationRules.meetingLink.message.required;
    } else if (!isValidUrl(formData.meetingLink)) {
      errors.meetingLink = sessionValidationRules.meetingLink.message.invalid;
    }
  }


  if (formData.county && formData.county.length < sessionValidationRules.county.min) {
    errors.county = sessionValidationRules.county.message.min;
  } else if (formData.county && formData.county.length > sessionValidationRules.county.max) {
    errors.county = sessionValidationRules.county.message.max;
  }

  return errors;
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};


export const isFutureDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(dateObj) && dateObj > new Date();
  } catch {
    return false;
  }
};


export const formatValidationErrors = (errors) => {
  const formatted = {};
  Object.keys(errors).forEach((key) => {
    if (errors[key]) {
      formatted[key] = errors[key];
    }
  });
  return formatted;
};

// Combined validation
export const prepareSessionData = (formData, isEdit = false) => {
  const data = {
    title: formData.title.trim(),
    skillArea: formData.skillArea,
    description: formData.description?.trim() || null,
    date: new Date(formData.date).toISOString(),
    durationMins: Number(formData.durationMins),
    locationType: formData.locationType,
    capacity: Number(formData.capacity),
    county: formData.county?.trim() || null,
  };

  // Conditional fields
  if (formData.locationType === LOCATION_TYPES.PHYSICAL) {
    data.venue = formData.venue?.trim() || null;
  } else {
    data.venue = null;
  }

  //  for edit
  if (isEdit && formData.status) {
    data.status = formData.status;
  }

  return data;
};

// Reset form 
export const getDefaultSessionData = () => ({
  title: '',
  description: '',
  skillArea: '',
  locationType: LOCATION_TYPES.ONLINE,
  county: '',
  venue: '',
  capacity: 30,
  date: '',
  durationMins: 120,
  status: SESSION_STATUS.SCHEDULED,
});

// Populate form for editing
export const populateSessionData = (session) => ({
  title: session.title || '',
  description: session.description || '',
  skillArea: session.skillArea || '',
  locationType: session.locationType || LOCATION_TYPES.ONLINE,
  county: session.county || '',
  venue: session.venue || '',
  capacity: session.capacity || 30,
  date: session.date ? formatDateForInput(session.date) : '',
  durationMins: session.durationMins || 120,
  status: session.status || SESSION_STATUS.SCHEDULED,
});


export const formatDateForInput = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return '';
    return dateObj.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};