
import { format, isValid, parseISO, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';

/**
 * Safely format a date with fallback
 * @param {string|Date} date - The date to format
 * @param {string} formatString - The format string (default: 'PPP')
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid date')
 * @returns {string} Formatted date string or fallback
 */
export const safeFormatDate = (date, formatString = 'PPP', fallback = 'Invalid date') => {
  if (!date) return fallback;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(parsedDate)) {
      return fallback;
    }
    
    return format(parsedDate, formatString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return fallback;
  }
};

/**
 * Safely format time
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid time')
 * @returns {string} Formatted time string or fallback
 */
export const safeFormatTime = (date, fallback = 'Invalid time') => {
  return safeFormatDate(date, 'h:mm a', fallback);
};

/**
 * Safely format date short (MMM d, yyyy)
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid date')
 * @returns {string} Formatted date string or fallback
 */
export const safeFormatDateShort = (date, fallback = 'Invalid date') => {
  return safeFormatDate(date, 'MMM d, yyyy', fallback);
};

/**
 * Safely format date with time
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid date')
 * @returns {string} Formatted date and time string or fallback
 */
export const safeFormatDateTime = (date, fallback = 'Invalid date') => {
  return safeFormatDate(date, 'PPP p', fallback);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid date')
 * @returns {string} Relative time string or fallback
 */
export const safeFormatRelative = (date, fallback = 'Invalid date') => {
  if (!date) return fallback;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(parsedDate)) {
      return fallback;
    }
    
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.warn('Relative date formatting error:', error);
    return fallback;
  }
};

/**
 * Get strict relative time (e.g., "2d" or "3h")
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: 'Invalid date')
 * @returns {string} Strict relative time string or fallback
 */
export const safeFormatRelativeStrict = (date, fallback = 'Invalid date') => {
  if (!date) return fallback;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(parsedDate)) {
      return fallback;
    }
    
    return formatDistanceToNowStrict(parsedDate, { addSuffix: true });
  } catch (error) {
    console.warn('Strict relative date formatting error:', error);
    return fallback;
  }
};

/**
 * Check if a date is valid
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(parsedDate);
  } catch {
    return false;
  }
};

/**
 * Get a safe Date object or null
 * @param {string|Date} date - The date to parse
 * @returns {Date|null} Date object or null if invalid
 */
export const getSafeDate = (date) => {
  if (!date) return null;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) return false;
  return safeDate < new Date();
};

/**
 * Check if a date is in the future
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) return false;
  return safeDate > new Date();
};

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) return false;
  
  const today = new Date();
  return safeDate.getDate() === today.getDate() &&
         safeDate.getMonth() === today.getMonth() &&
         safeDate.getFullYear() === today.getFullYear();
};

/**
 * Format a date for API (ISO string)
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value if date is invalid (default: '')
 * @returns {string} ISO date string or fallback
 */
export const safeToISOString = (date, fallback = '') => {
  const safeDate = getSafeDate(date);
  if (!safeDate) return fallback;
  return safeDate.toISOString();
};

/**
 * Get date parts (day, month, year) safely
 * @param {string|Date} date - The date to parse
 * @returns {Object} { day, month, year } or null values
 */
export const getDateParts = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) {
    return { day: null, month: null, year: null };
  }
  
  return {
    day: safeDate.getDate(),
    month: safeDate.getMonth() + 1,
    year: safeDate.getFullYear(),
  };
};

/**
 * Get day and month abbreviation for calendar display
 * @param {string|Date} date - The date to parse
 * @returns {Object} { day: '01', month: 'Jan' } or null values
 */
export const getCalendarDisplay = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) {
    return { day: '??', month: '??' };
  }
  
  return {
    day: String(safeDate.getDate()).padStart(2, '0'),
    month: safeFormatDate(safeDate, 'MMM', '???'),
  };
};

/**
 * Get time components safely
 * @param {string|Date} date - The date to parse
 * @returns {Object} { hours, minutes, ampm } or null values
 */
export const getTimeComponents = (date) => {
  const safeDate = getSafeDate(date);
  if (!safeDate) {
    return { hours: null, minutes: null, ampm: null };
  }
  
  let hours = safeDate.getHours();
  const minutes = String(safeDate.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  if (hours === 0) hours = 12;
  if (hours > 12) hours -= 12;
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes,
    ampm,
  };
};

/**
 * Format date for display in cards
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback value (default: 'No date')
 * @returns {string} Formatted date for card display
 */
export const formatCardDate = (date, fallback = 'No date') => {
  const safeDate = getSafeDate(date);
  if (!safeDate) return fallback;
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (isToday(safeDate)) {
    return `Today at ${safeFormatTime(safeDate)}`;
  }
  
  if (safeDate.getDate() === tomorrow.getDate() &&
      safeDate.getMonth() === tomorrow.getMonth() &&
      safeDate.getFullYear() === tomorrow.getFullYear()) {
    return `Tomorrow at ${safeFormatTime(safeDate)}`;
  }
  
  return safeFormatDate(safeDate, 'EEE, MMM d at h:mm a');
};

/**
 * Calculate duration between two dates safely
 * @param {string|Date} start - Start date
 * @param {string|Date} end - End date
 * @param {string} unit - 'minutes', 'hours', 'days'
 * @returns {number} Duration in specified unit
 */
export const safeDuration = (start, end, unit = 'minutes') => {
  const startDate = getSafeDate(start);
  const endDate = getSafeDate(end);
  
  if (!startDate || !endDate) return 0;
  
  const diffMs = endDate.getTime() - startDate.getTime();
  
  switch (unit) {
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    default:
      return diffMs;
  }
};

/**
 * Format a date range
 * @param {string|Date} start - Start date
 * @param {string|Date} end - End date
 * @param {string} fallback - Fallback value (default: 'Invalid date range')
 * @returns {string} Formatted date range
 */
export const safeFormatDateRange = (start, end, fallback = 'Invalid date range') => {
  const startDate = getSafeDate(start);
  const endDate = getSafeDate(end);
  
  if (!startDate && !endDate) return fallback;
  if (startDate && !endDate) return safeFormatDate(startDate, 'PPP');
  if (!startDate && endDate) return safeFormatDate(endDate, 'PPP');
  
  // Both dates exist
  const startFormatted = safeFormatDate(startDate, 'MMM d');
  const endFormatted = safeFormatDate(endDate, 'd, yyyy');
  
  return `${startFormatted} - ${endFormatted}`;
};

export default {
  safeFormatDate,
  safeFormatTime,
  safeFormatDateShort,
  safeFormatDateTime,
  safeFormatRelative,
  safeFormatRelativeStrict,
  isValidDate,
  getSafeDate,
  isPastDate,
  isFutureDate,
  isToday,
  safeToISOString,
  getDateParts,
  getCalendarDisplay,
  getTimeComponents,
  formatCardDate,
  safeDuration,
  safeFormatDateRange,
};