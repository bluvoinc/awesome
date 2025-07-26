/**
 * Bluvo API - Common Utilities
 * Reusable helper functions for API examples
 */

import { BluvoClient } from "@bluvo/sdk-ts";
import { GetWorkflow200ResponseStepsInnerStateEnum } from "@bluvo/sdk-ts/generated/models/GetWorkflow200ResponseStepsInner";

/**
 * Sleep function for async delays
 * @param ms - Milliseconds to sleep
 */
// @ts-ignore
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function for GET requests
 * @param url - The URL to fetch
 * @param headers - Request headers
 * @returns Response JSON
 */
export const get = async (url: string, headers: Record<string, string>) => {
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
) => {
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

/**
 * Helper function for PUT requests
 * @param url - The URL to fetch
 * @param headers - Request headers
 * @param body - Request body
 * @returns Response JSON
 */
export const put = async (
  url: string, 
  headers: Record<string, string>, 
  body: any
) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

/**
 * Poll workflow status until completion or failure
 * @param client - Bluvo client instance
 * @param workflowRunId - The workflow run ID to poll
 * @param pollIntervalMs - Polling interval in milliseconds (default: 3000)
 * @returns Promise that resolves with final workflow status
 */
export const pollWorkflowStatus = async (
  client: BluvoClient,
  workflowRunId: string,
  workflowType: 'connect' | 'withdraw' | 'oauth2',
  pollIntervalMs: number = 3000
) => {
  while (true) {
    const status = await client.workflow
        .get(
            workflowRunId,
            workflowType
        );
    
    console.log(
      '⏳ Polling workflow status:',
      status
    );

    const workflowStatus = status.details.status;
    const isCompleted = workflowStatus === 'complete';
    const isRunning = ['queued', 'running'].indexOf(workflowStatus) !== -1;

    if (isCompleted) {
      console.log('✅ Workflow completed successfully:', status);
      return status;
    }

    if (!isRunning) {
      console.error('❌ Workflow failed:', status);
      throw new Error('Workflow execution failed');
    }

    // Wait before polling again
    await sleep(pollIntervalMs);
  }
};