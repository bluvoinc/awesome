/**
 * Bluvo API - Common Utilities
 * Reusable helper functions for API examples
 */

/**
 * Sleep function for async delays
 * @param ms - Milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function for GET requests
 * @param url - The URL to fetch
 * @param headers - Request headers
 * @returns Response JSON
 */
export const get = async (url: string, headers: Record<string, string>): Promise<any> => {
  try {
    const response = await fetch(url, { 
      method: 'GET', 
      headers 
    });
    
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

/**
 * Helper function for POST requests
 * @param url - The URL to fetch
 * @param headers - Request headers
 * @param body - Request body
 * @returns Response JSON
 */
export const post = async (
  url: string, 
  headers: Record<string, string>, 
  body: any
): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};