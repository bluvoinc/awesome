"use server";


import {MY_BLUVO_SECRET_KEY} from "@/sec";

export const requestOTT = async () => {

    const args = {
        orgId: "bluvo-org-a2e98409-cd68-48c4-853c-73d9228764c0",
        projectId: "b16e1c13-74ad-4b95-b252-0c12e2215b18",
    };

    // TODO: or use @bluvo/sdk-ts
    let baseUrl = `https://api-bluvo.com/v0/ott/token?wantOtt=true&wantSubscribe=true`;

    if(!args.orgId || !args.projectId) {
        throw new Error("Missing required parameters: orgId and projectId are required.");
    }

    const options = {
        method: 'GET',
        headers: {
            'x-bluvo-api-key': MY_BLUVO_SECRET_KEY,
            //args.apiKeySecret,
            'x-bluvo-org-id': args.orgId,
            'x-bluvo-project-id': args.projectId,
        }
    };

    try {
        const response = await fetch(baseUrl, options);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(`Error: ${data.error || 'Unknown error'}`);
        }
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to request one-time token: ${error}`);
    }
}