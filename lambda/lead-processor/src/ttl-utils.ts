/**
 * TTL Calculation Utilities
 * 
 * Provides functions for calculating Time-To-Live (TTL) values for DynamoDB records.
 * TTL is set to 18 months from the submission timestamp.
 */

/**
 * Calculates TTL timestamp for a submission
 * 
 * The TTL is calculated as submission timestamp + 18 months.
 * This function handles edge cases including:
 * - Leap years
 * - Month boundaries (months with different day counts)
 * - End-of-month dates
 * 
 * @param submissionTimestamp - Unix timestamp in milliseconds of the submission
 * @returns Unix timestamp in seconds for DynamoDB TTL (18 months from submission)
 * 
 * @example
 * const submissionTime = Date.now(); // e.g., 2024-01-15
 * const ttl = calculateTTL(submissionTime); // Returns timestamp for 2025-07-15
 */
export function calculateTTL(submissionTimestamp: number): number {
  // Convert milliseconds to Date object
  const submissionDate = new Date(submissionTimestamp);
  
  // Create a new date for TTL calculation
  const ttlDate = new Date(submissionDate);
  
  // Add 18 months
  const currentMonth = ttlDate.getMonth();
  const currentYear = ttlDate.getFullYear();
  
  // Calculate new month and year
  const newMonth = (currentMonth + 18) % 12;
  const yearsToAdd = Math.floor((currentMonth + 18) / 12);
  const newYear = currentYear + yearsToAdd;
  
  // Set the new year and month
  ttlDate.setFullYear(newYear);
  ttlDate.setMonth(newMonth);
  
  // Handle edge case: if original date was end of month (e.g., Jan 31)
  // and target month has fewer days (e.g., June 30), adjust to last day of target month
  const originalDay = submissionDate.getDate();
  const lastDayOfTargetMonth = new Date(newYear, newMonth + 1, 0).getDate();
  
  if (originalDay > lastDayOfTargetMonth) {
    ttlDate.setDate(lastDayOfTargetMonth);
  } else {
    ttlDate.setDate(originalDay);
  }
  
  // Convert to Unix timestamp in seconds (DynamoDB TTL uses seconds)
  return Math.floor(ttlDate.getTime() / 1000);
}

/**
 * Validates that a TTL value is correctly calculated for a given submission timestamp
 * 
 * @param submissionTimestamp - Unix timestamp in milliseconds of the submission
 * @param ttl - TTL value in seconds to validate
 * @returns true if TTL is correctly calculated, false otherwise
 * 
 * @example
 * const submissionTime = Date.now();
 * const ttl = calculateTTL(submissionTime);
 * const isValid = validateTTL(submissionTime, ttl); // Returns true
 */
export function validateTTL(submissionTimestamp: number, ttl: number): boolean {
  const expectedTTL = calculateTTL(submissionTimestamp);
  return ttl === expectedTTL;
}

/**
 * Gets the expiration date for a given TTL value
 * 
 * @param ttl - TTL value in seconds
 * @returns Date object representing the expiration date
 * 
 * @example
 * const ttl = calculateTTL(Date.now());
 * const expirationDate = getTTLExpirationDate(ttl);
 * console.log(`Data will be deleted on: ${expirationDate.toISOString()}`);
 */
export function getTTLExpirationDate(ttl: number): Date {
  return new Date(ttl * 1000);
}
