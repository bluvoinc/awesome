# Bluvo Widget for Svelte

This repository demonstrates how to integrate the [@bluvo/widget-svelte library](https://www.npmjs.com/package/@bluvo/widget-svelte) into your Svelte application.

## Installation

```bash
# npm
npm install @bluvo/widget-svelte

# pnpm
pnpm add @bluvo/widget-svelte

# yarn
yarn add @bluvo/widget-svelte
```

## Basic Usage

1. Import the component and types:

```typescript
import type { BluvoWidgetProps } from '@bluvo/widget-svelte';
import { BluvoWidget } from '@bluvo/widget-svelte';
```

2. For SvelteKit applications, use dynamic imports to ensure browser-only loading:

```typescript
import type { BluvoWidgetProps } from '@bluvo/widget-svelte';
import { onMount } from 'svelte';
import { browser } from '$app/environment';

let BluvoWidget: typeof import('@bluvo/widget-svelte').BluvoWidget;

onMount(async () => {
  if (browser) {
    const module = await import('@bluvo/widget-svelte');
    BluvoWidget = module.BluvoWidget;
  }
});
```

3. Configure the widget props:

```typescript
const widgetProps: BluvoWidgetProps = {
  auth: {
    orgId: 'bluvo-org-your-org-id', // From Bluvo portal
    projectId: 'your-project-id',   // From Bluvo portal
  },
  // Other configuration options...
};
```

4. Use the component in your Svelte template:

```svelte
{#if BluvoWidget}
  <svelte:component this={BluvoWidget} {...widgetProps} />
{:else}
  <p>Loading widget...</p>
{/if}
```

## Configuration Options

The widget is highly configurable through the `BluvoWidgetProps` interface:

### 1. Authentication

```typescript
auth: {
  orgId: 'bluvo-org-your-org-id', // From https://portal.bluvo.co
  projectId: 'your-project-id',   // From https://portal.bluvo.co
}
```

### 2. Widget Appearance

```typescript
// Enable debug logging (disable in production)
debug: true,

// Token storage strategy: 'localStorage', 'sessionStorage' or 'none'
storage: 'localStorage', 

// Branding and legal links
showBranding: true,
showTOS: true,
termsOfServiceLink: 'https://yourdomain.com/terms',
privacyPolicyLink: 'https://yourdomain.com/privacy',

// Widget width (in pixels or CSS value)
width: 400,
```

### 3. Operation Mode

The widget supports two primary modes:

```typescript
// 'connect': Allow users to link exchange accounts/wallets
// 'transact': Allow users to initiate withdrawals/transfers
mode: 'connect', // or 'transact'
```

### 4. Exchange List

Customize which exchanges are available:

```typescript
exchanges: [
  // Centralized exchanges (CEX)
  'binance',
  'coinbase',
  'kraken',
  // Add others as needed
]
```

### 5. Connect Mode Settings

When `mode: 'connect'`, these options apply:

```typescript
connect: {
  showSearch: false,               // Show exchange search bar
  showSuccessDetails: true,        // Show details after successful linking
  
  // IP whitelisting (optional)
  ipList: [],
  useCustomIpList: false,
  
  // Exchange logo customization
  exchangeList: {
    logoSize: 40,
  },
  
  // Event callbacks
  onSuccess: (walletId: string) => {
    console.log('Wallet connected:', walletId);
  },
  onComplete: (walletId: string) => {
    console.log('User completed linking:', walletId);
  },
}
```

### 6. Transaction Mode Settings

When `mode: 'transact'`, these options apply:

```typescript
transaction: {
  // Optional default coin
  // defaultCoin: 'ETH',
  
  // Optional whitelist of supported coins
  // coins: ['ETH', 'USDT', 'BTC'],
  
  showSuccessDetails: true,
  
  // IP whitelisting (optional)
  ipList: [],
  useCustomIpList: false,
  
  // Pre-fill transaction fields by coin
  prefill: {
    address: {
      ETH: '0x1234567890abcdef1234567890abcdef12345678',
      BTC: 'bc1qxyz1234567890abcdefg1234567890abcdefg',
    },
    amount: {
      ETH: 0.01,
      BTC: 0.001,
    },
    // Optional tags for coins like XRP
    // tag: {
    //   XRP: '1234567890',
    // },
  },
  
  // Control how fields are displayed:
  // - 'input': editable text field
  // - 'label': read-only text label
  // - 'none': hide field entirely
  display: {
    address: 'input',
    amount: 'input',
    tag: 'none',
  },
  
  // Event callbacks
  onSuccess: (txId: string) => {
    console.log('Transaction successful:', txId);
  },
  onComplete: (txId: string) => {
    console.log('User completed transaction:', txId);
  },
}
```

### 7. Showcase Mode (Demo/Testing)

For demos or UI testing without real API calls:

```typescript
showcase: {
  enabled: true,
  page: 'connect', // 'connect', 'transact', or 'success'
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Learn More

Visit the [Bluvo Portal](https://portal.bluvo.co) to create your account and get API credentials.