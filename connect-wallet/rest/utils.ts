import {get, sleep} from "../../utils";

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

/**
 * Poll workflow status until completion or failure
 */
export async function pollWorkflow(workflowRunId: string, headers: Record<string, string>) {
    const MAX_ATTEMPTS = 10;
    const POLLING_INTERVAL = 3000; // 3 seconds

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        console.log(`⏳ Polling workflow (attempt ${attempt + 1}/${MAX_ATTEMPTS})...`);

        const response = await get(
            `${BASE_URL}/v0/workflow/runs/${workflowRunId}`,
            headers
        );

        const { steps } = response;

        // Check if workflow is complete
        if (!steps || steps.length >= 3) {
            console.log('✓ Workflow completed successfully');
            return;
        }

        // Check for workflow failure
        if (steps.length > 0 && steps[steps.length - 1].state === 'RUN_FAILED') {
            const errorDetails = steps[steps.length - 1];
            console.error('✗ Workflow failed:', errorDetails);
            throw new Error(`Workflow execution failed: ${JSON.stringify(errorDetails)}`);
        }

        // Wait before next polling attempt
        await sleep(POLLING_INTERVAL);
    }

    console.warn('⚠️ Polling timed out - workflow may still be running');
}