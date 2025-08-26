/**
 * Utility functions for consistent date formatting across server and client
 * Prevents hydration mismatches by using consistent formatting
 */

export function formatDate(dateString: string, format: 'long' | 'short' = 'long'): string {
  const date = new Date(dateString)
  
  if (format === 'short') {
    // Use a simple format that's consistent across server/client
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  
  // Long format - use consistent month names
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function formatDateForDisplay(dateString: string): string {
  return formatDate(dateString, 'long')
}

export function formatDateShort(dateString: string): string {
  return formatDate(dateString, 'short')
}
