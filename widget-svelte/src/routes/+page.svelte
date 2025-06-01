<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    
    let BluvoWidget;
    
    // Example configuration
    const auth = {
        projectId: 'your-project-id',
        orgId: 'your-org-id',
    };

    // Widget success callback
    const handleSuccess = (walletId: string) => {
        console.log('Wallet connected:', walletId);
    };
    
    onMount(async () => {
        if (browser) {
            const module = await import('@bluvo/widget-svelte');
            BluvoWidget = module.BluvoWidget;
        }
    });
</script>

<main>
    <h1>Bluvo Svelte Widget Example</h1>


    <!-- Widget container -->
    <div class="widget-container">
        {#if BluvoWidget}
            <svelte:component 
                this={BluvoWidget}
                auth={auth}
                width={400}
                mode="connect"
                exchanges={[
                    'binance',
                    'coinbase',
                    'kraken',
                    'kucoin',
                    'bybit',
                    'gateio',
                    'gemini',
                    "bingx",
                    "bitbank",
                    "bitfinex",
                    "bitflyer",
                    "bithumb",
                    "bitmart",
                    "bitmex",
                    "bitopro",
                    "bitso",
                    "bitstamp",
                    "bitvavo",
                    "blofin",
                    "btcmarkets",
                    "bybit",
                    "coincheck",
                    "coinex",
                    "coinsph",
                    "cryptocom",
                    "deribit",
                    "digifinex",
                    "fmfwio",
                    "gateio",
                    "gemini",
                    "hashkey",
                    "indodax",
                    "kucoin",
                    "latoken",
                    "lbank",
                    "luno",
                    "mexc",
                    "okx",
                    "phemex",
                    "timex",
                    "upbit",
                    "woo",
                    "xt"
                    ]}
                connect={{
                    onSuccess: handleSuccess,
                    showSuccessDetails: true
                  }}
                class="custom-widget"
            />
        {:else}
            <p>Loading widget...</p>
        {/if}
    </div>
</main>

<style>
    main {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: #333;
        text-align: center;
    }

    .status {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .actions {
        margin-top: 15px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    button {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #c0392b;
    }

    .widget-container {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .custom-widget {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
</style>