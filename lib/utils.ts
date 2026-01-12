import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date in a consistent, user-friendly format
 * @param date - Date to format (string, Date object, or number)
 * @returns Formatted date string (e.g., "15 Mar 2023")
 */
export function formatDate(date: string | Date | number): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
