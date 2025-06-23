/**
 * Bluvo API - Common Utilities
 * Reusable helper functions for API examples
 */

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
  client: any,
  workflowRunId: string,
  pollIntervalMs: number = 3000
) => {
  while (true) {
    const status = await client.workflow.get(workflowRunId);
    
    console.log(
      '⏳ Polling workflow status:',
      status.steps.map((step: any) => step.name).join(', ')
    );

    // Check if any step failed
    const hasFailedStep = status.steps.some(
      (step: any) => step.state !== GetWorkflow200ResponseStepsInnerStateEnum.StepSuccess
    );
    
    if (hasFailedStep) {
      console.error('❌ Workflow failed:', status.steps);
      throw new Error('Workflow execution failed');
    }

    // Check if workflow completed successfully
    const isCompleted = status.steps.some(
      (step: any) =>
        step.isEnd &&
        step.state === GetWorkflow200ResponseStepsInnerStateEnum.StepSuccess
    );

    if (isCompleted) {
      console.log('✅ Workflow completed successfully:', status.steps);
      return status;
    }

    // Wait before polling again
    await sleep(pollIntervalMs);
  }
};