"use server";

// TODO: Import the secret based on your project setup
import {MY_BLUVO_SECRET_KEY} from "@/sec";
import {createClient} from "@bluvo/sdk-ts";

export const requestOTT = async (walletId?:string):Promise<{
    ott?: string;
    idem?: string;
    topic?: {
        success: boolean;
        name: string;
        token: string;
        expiresAt?: number | undefined;
        error?: string | undefined;
        message?: string | undefined;
    };
}> => {

    const args = {
        orgId: "bluvo-org-a2e98409-cd68-48c4-853c-73d9228764c0", // load me from .env or config
        projectId: "b16e1c13-74ad-4b95-b252-0c12e2215b18", // load me from .env or config
    };

    // Bluvo API credentials - Replace with your own from https://docs.bluvo.co/introduction
    const client = createClient({
        apiKey: MY_BLUVO_SECRET_KEY!,
        orgId: args.orgId!,
        projectId: args.projectId!,
    } as any);

    const {
        ott,
        idem,
        topic,
    } = await client
        .ott
        // we're client-side using OTT with websocket, so we use .getWithSubscribe otherwise use .get
        .getWithSubscribe(
            walletId,
        );

    if(!ott) {
        throw new Error("Failed to retrieve one-time token (OTT). Please check your credentials and try again.");
    }

    return {
        ott,
        idem,
        topic: {
            ...topic,
            success: true,
            name: topic?.name ?? idem,
            token: topic?.token!,
        }
    }
}