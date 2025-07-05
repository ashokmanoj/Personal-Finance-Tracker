import { DateRange } from '../types';

/**
 * Converts a string to a Date object.
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Formats a Date object as 'YYYY-MM-DD'.
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formats a date string as 'MMM D, YYYY'.
 * E.g., '2025-07-05' => 'Jul 5, 2025'
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a month as 'YYYY-MM'.
 */
export const formatMonth = (date: Date): string => {
  return date.toISOString().substring(0, 7);
};

/**
 * Formats a year as 'YYYY'.
 */
export const formatYear = (date: Date): string => {
  return date.getFullYear().toString();
};

/**
 * Gets full month name from a Date.
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Gets full month name from 'YYYY-MM' format.
 */
export const getMonthNameFromString = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return getMonthName(date);
};

/**
 * Gets current month in 'YYYY-MM' format.
 */
export const getCurrentMonth = (): string => {
  return formatMonth(new Date());
};

/**
 * Gets current year in 'YYYY' format.
 */
export const getCurrentYear = (): string => {
  return formatYear(new Date());
};

/**
 * Returns the date range for the current month.
 */
export const getCurrentMonthRange = (): DateRange => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Returns the date range for the current year.
 */
export const getCurrentYearRange = (): DateRange => {
  const year = new Date().getFullYear();
  return {
    startDate: formatDate(new Date(year, 0, 1)),
    endDate: formatDate(new Date(year, 11, 31)),
  };
};

/**
 * Returns the last 30 days from today.
 */
export const getLast30DaysRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Returns the last 90 days from today.
 */
export const getLast90DaysRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Returns the date range for a specific month.
 */
export const getMonthRange = (yearMonth: string): DateRange => {
  const [year, month] = yearMonth.split('-').map(Number);
  return {
    startDate: formatDate(new Date(year, month - 1, 1)),
    endDate: formatDate(new Date(year, month, 0)),
  };
};

/**
 * Returns the date range for a specific year.
 */
export const getYearRange = (year: string): DateRange => {
  return {
    startDate: formatDate(new Date(Number(year), 0, 1)),
    endDate: formatDate(new Date(Number(year), 11, 31)),
  };
};

/**
 * Returns an array of last N months in 'YYYY-MM' format.
 */
export const getLastNMonths = (n: number): string[] => {
  const result: string[] = [];
  const now = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(formatMonth(date));
  }

  return result;
};

/**
 * Returns all months of a year in 'YYYY-MM' format.
 */
export const getMonthsInYear = (year: string): string[] => {
  const result: string[] = [];
  for (let month = 0; month < 12; month++) {
    result.push(formatMonth(new Date(Number(year), month, 1)));
  }
  return result;
};

/**
 * Formats a readable date range.
 * Examples:
 *  - "Jul 1 – 5, 2025" (same month/year)
 *  - "Jul 1 – Aug 5, 2025" (same year)
 *  - "Dec 31, 2024 – Jan 2, 2025" (different years)
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} – ${end.toLocaleDateString('en-US', {
      day: 'numeric',
      year: 'numeric',
    })}`;
  }

  if (sameYear) {
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} – ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  }

  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} – ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
};
