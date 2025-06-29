"use client"

import 'react';
import {BluvoWidget, BluvoWidgetProps} from "@bluvo/widget-react";
import {requestOTT} from "@/app/actions/server";

function App() {

    const settings: BluvoWidgetProps = {
        baseUrl: "https://api-bluvo.com",
        // Authentication credentials
        auth: {
            orgId: "bluvo-org-a2e98409-cd68-48c4-853c-73d9228764c0",
            projectId: "b16e1c13-74ad-4b95-b252-0c12e2215b18",
            // Function to fetch a one-time token (OTT)
            ottFn: requestOTT
        },
        // Core settings
        mode: "transact", // "connect" or "transact"

        // Complete list of exchanges supported by the widget:
        // https://docs.bluvo.co/exchanges
        exchanges: [
            "binance",
            "coinbase",
            "kraken",
            "kucoin",
            "bybit",
            "cryptocom",
            "gateio",
            "gemini",
        ],

        // storage: "localStorage", // or "none"
        storage: 'none',

        // Optional theme customization
        theme: {
            dark: true,
            accentColor: "#3B82F6" // blue-500
        },

        showBranding: true,
        showTOS: true,
        termsOfServiceLink: "https://bluvo.co/terms",
        privacyPolicyLink: "https://bluvo.co/privacy",

        // Connection configuration
        connect: {
            showSearch: true,
            showSuccessDetails: false,

            exchangeList: {
                logoSize: 40
            },

            // Connection callbacks
            onSuccess: (walletId) => {
                console.log("Wallet connected:", walletId);
            },
            onComplete: (walletId) => {
                console.log("Connection completed with wallet:", walletId);
            },

            // TODO: possibility to provide an URL that will be fetched
            ipList: '216.173.96.160 64.137.11.35 64.137.11.43 64.137.11.121 193.160.236.132 216.173.96.132 154.7.188.20 193.160.236.153 185.102.49.232 193.160.236.110 185.102.49.224 185.102.49.33 154.22.134.246 154.7.188.71 216.173.96.184 156.238.4.9 185.102.48.248 216.173.96.45 154.37.183.149'
                .split(' ')
        },

        // Transaction configuration
        transaction: {
            defaultCoin: "LTC",
            coins: ["BTC", "ETH", "USDC", "USDT", "SOL", "LTC", "XRP", "XLM", "TRX"],
            showSuccessDetails: false,

            // Form field display modes
            display: {
                address: "label",
                tag: "none",
                amount: "input"
            },

            // Prefilled form values
            prefill: {
                address: {
                    BTC: "bc1q3c8g6",
                    ETH: "0x3c8g6",
                    LTC: "ltc1q4cj9y83hg5f5zvwu8f2he4g9j6u8l7skw3q5tu"
                },
                tag: {
                    XRP: "123456",
                    XLM: "123456",
                    TRX: "123456"
                },
                amount: {
                    BTC: 0.1,
                    ETH: 0.1,
                    LTC: 0.04,
                    XRP: 100,
                    XLM: 100,
                    TRX: 100
                }
            },

            // Transaction callbacks
            onSuccess: (tx) => {
                console.log("Transaction successful:", tx);
            },
            onComplete: (tx) => {
                console.log("Transaction completed:", tx);
            },

            // TODO: possibility to provide an URL that will be fetched
            ipList: '216.173.96.160 64.137.11.35 64.137.11.43 64.137.11.121 193.160.236.132 216.173.96.132 154.7.188.20 193.160.236.153 185.102.49.232 193.160.236.110 185.102.49.224 185.102.49.33 154.22.134.246 154.7.188.71 216.173.96.184 156.238.4.9 185.102.48.248 216.173.96.45 154.37.183.149'
                .split(' ')
        },

        showcase: {
            enabled: false,
        },
        debug: true,
    }

    return (
        <div className="app" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '20px'
        }}>
            <h1>Bluvo Widget Demo</h1>

            <BluvoWidget
                {...settings}
            />
        </div>
    );
}

export default App;