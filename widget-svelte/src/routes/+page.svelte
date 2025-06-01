<script lang="ts">
    import type { BluvoWidgetProps } from '@bluvo/widget-svelte';
    import { onMount } from 'svelte';
    let BluvoWidget: typeof import('@bluvo/widget-svelte').BluvoWidget;

    // @ts-ignore
    import { browser } from '$app/environment';

    const widgetProps: BluvoWidgetProps = {
        /***************************************************************************************************
         * 1. AUTHENTICATION
         *
         *    These credentials come from your Bluvo portal (https://portal.bluvo.co). They allow the widget
         *    to authenticate every request to Bluvo’s backend. Replace with your own Org ID and Project ID.
         **************************************************************************************************/
        auth: {
            orgId: 'bluvo-org-your-org-id',
            projectId: 'your-project-id',
        },

        /***************************************************************************************************
         * 2. WIDGET-LEVEL CONFIGURATION
         *
         *    These flags control general widget behavior and appearance.
         **************************************************************************************************/
        // If true, Bluvo will log extra debug info to the console. Set this to `false` in production.
        debug: true,

        // Controls how Bluvo stores OAuth2 tokens:
        //   - "localStorage": tokens survive page reloads
        //   - "sessionStorage": tokens shareable within single tab session (not yet implemented)
        //   - "none": tokens live in memory only, and are lost on reload
        storage: 'localStorage', // suggested "none"

        // Show or hide Bluvo branding at the bottom of the widget.
        showBranding: true,

        // Whether to show a “Terms of Service” and “Privacy Policy” link in the footer.
        showTOS: true,
        termsOfServiceLink: 'https://bluvo.co/terms',
        privacyPolicyLink: 'https://bluvo.co/privacy',

        // Width of the widget container (in pixels or any valid CSS width value).
        // Defaults to 360 if omitted.
        width: 400,

        /***************************************************************************************************
         * 3. DEFAULT OPERATION MODE
         *
         *    The widget can operate in two mutually exclusive modes:
         *      - "connect": allow users to link their exchange accounts or wallets
         *      - "transact": allow users to initiate withdrawals/transfers
         **************************************************************************************************/
        mode: 'transact',

        /***************************************************************************************************
         * 4. EXCHANGES LIST (DEX-FIRST ORDERING)
         *
         *    Bluvo will only show the exchanges that you list here. Because you want your DEXs to appear
         *    at the very top, we place popular decentralized‐exchange protocols first, then the major CEXs.
         *
         *    (If Bluvo does not support a particular string, it will simply hide it—so feel free to experiment.)
         **************************************************************************************************/
        exchanges: [
            // --- TOP DECENTRALIZED EXCHANGES (DEX) ---
            // not supported yet
            // 'uniswap',
            // 'sushiswap',
            // 'pancakeswap',
            // 'curve',
            // 'balancer',
            // '1inch',
            // --- CENTRALIZED EXCHANGES (CEX) ---
            'binance',
            'coinbase',
            'kraken',
            'kucoin',
            'bybit',
            'gateio',
            'gemini',
            'bingx',
            'bitbank',
            'bitfinex',
            'bitflyer',
            'bithumb',
            'bitmart',
            'bitmex',
            'bitopro',
            'bitso',
            'bitstamp',
            'bitvavo',
            'blofin',
            'btcmarkets',
            'coincheck',
            'coinex',
            'coinsph',
            'cryptocom',
            'deribit',
            'digifinex',
            'fmfwio',
            'hashkey',
            'indodax',
            'latoken',
            'lbank',
            'luno',
            'mexc',
            'okx',
            'phemex',
            'timex',
            'upbit',
            'woo',
            'xt',
        ],

        /***************************************************************************************************
         * 5. CONNECT MODE SETTINGS
         *
         *    These options are only used if you set `mode: 'connect'`. They let you:
         *      - Show a search/filter bar
         *      - Customize which exchange logos appear (and how large they are)
         *      - White-list IPs (if your API requires it)
         *      - Hook into success/completion callbacks
         **************************************************************************************************/
        connect: {
            // Show a search‐bar above the exchange list (set to true to enable).
            showSearch: false,

            // When a user successfully links an account, Bluvo shows details by default.
            // If you want to hide those details and just show the “Done” button, set this to false.
            showSuccessDetails: true,

            // If you only want certain IP addresses to be able to call your Bluvo backend,
            // list them here. (Enable `useCustomIpList` to enforce it.)
            // Specifying `ipList` is optional; if you don’t need IP whitelisting, we'll use the shared one provided by Bluvo.
            // If you need dedicated ips, please contact Bluvo support https://cal.com/bluvo/30min
            // Otherwise, if you want to use your own IP list, set `useCustomIpList: true`, provide the list of ips in the ipList array,
            // and contact Bluvo to use your rotating-proxy IPs on our backend as well. (Soon you'll be able to do this yourself using the Bluvo portal.)
            ipList: [],
            useCustomIpList: false,

            // Size (in pixels) of each exchange’s logo in the grid. Defaults to 40px.
            exchangeList: {
                logoSize: 40,
            },

            // Called the instant a wallet/exchange is linked successfully.
            onSuccess: (walletId: string) => {
                console.log('✅ [Connect] Wallet connected:', walletId);
            },

            // Called when the user clicks “Done” on the success screen.
            onComplete: (walletId: string) => {
                console.log('✅ [Connect] User completed linking:', walletId);
            },
        },

        /***************************************************************************************************
         * 6. TRANSACTION MODE SETTINGS
         *
         *    These options only apply when `mode: 'transact'`. You can:
         *      - Preselect a coin, a default amount, and a default address
         *      - Control which fields (address, tag, amount) are rendered as inputs vs. read-only labels
         *      - White-list IPs if needed
         *      - Show/hide transaction success details
         *      - Hook into success/completion callbacks
         **************************************************************************************************/
        transaction: {
            // If you want to default the form to a particular coin (e.g. "ETH"),
            // uncomment and set `defaultCoin: "ETH"`.
            // defaultCoin: 'ETH',

            // If you only want withdrawals for a whitelist of coins, set them here.
            // coins: ['ETH', 'USDT', 'BTC'],

            // After a successful withdraw, Bluvo normally displays transaction details.
            // Set this to true if you want to show those details; false will skip them.
            showSuccessDetails: true,

            // If your backend only allows certain IPs to sign transaction requests, list them here.
            ipList: [],
            useCustomIpList: false,

            display: {
                tag: 'none', // Show tag field as an input (uncomment if you want to use tags)
                amount: "label",
            },

            // Prefill form fields by coin. This is handy if you already know the destination
            // address and amount you want the user to send. Bluvo will auto-fill those inputs.
            prefill: {
                address: {
                    LTC: 'ltc1qxyz1234567890abcdefg1234567890abcdefg',
                    BTC: 'bc1qxyz1234567890abcdefg1234567890abcdefg',
                    ETH: '0x1234567890abcdef1234567890abcdef12345678',
                },
                amount: {
                    LTC: 0.01,
                    BTC: 0.001,
                    ETH: 0.01,
                },
                // If you also want to prefill “destination tag” for coins like XRP, you can do:
                // tag: {
                //   XRP: '1234567890',
                // },
            },

            // Control how each field is rendered:
            //   - "input": editable text field
            //   - "label": read-only text label
            //   - "none": hide the field entirely
            display: {
                address: 'input',
                amount: 'input',
                // tag: 'input', // uncomment if you’re using tags
            },

            // Called when the transaction is broadcast successfully (i.e. TX ID is returned).
            onSuccess: (txId: string) => {
                console.log('✅ [Transact] Transaction successful:', txId);
            },

            // Called when the user clicks “Done” on the success screen.
            onComplete: (txId: string) => {
                console.log('✅ [Transact] User completed transaction:', txId);
            },
        },

        /***************************************************************************************************
         * 7. SHOWCASE CONFIGURATION
         *
         *    If you’d like to “fake” the widget entirely—so that no real HTTP calls go out—you can enable
         *    showcase mode. This is useful for demos or UI testing.
         **************************************************************************************************/
        // showcase: {
            // When `enabled: true`, the widget will run entirely in “fake” mode, ignoring real API calls.
            // enabled: false,

            // If you want to force-display a particular widget view during showcase, you can set “page”:
            //   - "connect": show the exchange/link-account UI
            //   - "transact": show the withdraw/transaction UI
            //   - "success": show the generic “Success!” afterwards
            // page: 'connect',
        // },
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
    <div class="widget-container">
        {#if BluvoWidget}
            <svelte:component this={BluvoWidget} {...widgetProps} class="custom-widget" />
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
