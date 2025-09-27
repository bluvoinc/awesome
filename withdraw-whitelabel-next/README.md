# Withdraw Whitelabel Next.js Example

A complete whitelabel React widget example using Next.js that demonstrates the Bluvo withdrawal flow with a fully customizable UI and state machine.

## Overview

This example showcases:
- **React Widget Integration**: Uses `@bluvo/react` for the withdrawal state machine
- **Server Actions**: Next.js server actions for backend operations  
- **Backend SDK**: `@bluvo/sdk-ts` for secure API calls to Bluvo
- **Fully Customizable UI**: Complete control over the user interface and styling
- **OAuth2 Flow**: Secure exchange connection via OAuth2

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and fill in your Bluvo credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials from [Bluvo Portal](https://portal.bluvo.co):

```env
BLUVO_ORG_ID=your-bluvo-org-id
BLUVO_PROJECT_ID=your-bluvo-project-id
BLUVO_API_KEY=your-bluvo-secret-id
```

### 2. Configure Public Keys

Open `src/app/home/page.tsx` and update the public keys (lines 45-46):

```typescript
const flow = useBluvoFlow({
    orgId: "your-bluvo-org-id",        // Replace with your public org ID
    projectId: "your-bluvo-project-id", // Replace with your public project ID
    // ... rest of configuration
});
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Connect Exchanges

1. Open http://localhost:3000 in your browser
2. Select an exchange from the dropdown
3. Click "Start New Withdrawal" 
4. Complete the OAuth2 flow to connect your exchange account
5. Follow the withdrawal flow through the various states

## Features

- **State Machine**: Handles all withdrawal states (OAuth, loading, quotes, 2FA, etc.)
- **Exchange Selection**: Dynamic loading of available exchanges
- **Resume Flow**: Ability to resume with previously connected wallets
- **Error Handling**: Comprehensive error states and retry mechanisms
- **Debug Mode**: Built-in state simulator for testing UI components
- **Responsive Design**: Mobile-friendly interface with CSS custom properties

## Project Structure

```
src/app/
├── actions/           # Server actions for backend operations
├── components/        # UI components for different flow states
├── home/             # Main page component
└── globals.css       # Global styles and CSS variables
```

## Customization

The UI is fully customizable through:
- CSS custom properties in `globals.css`
- Component modifications in `components/states/`
- Flow configuration in `home/page.tsx`

## Security Notes

- Environment variables are used for sensitive API keys
- OAuth2 flow handles secure exchange authentication
- No sensitive data is exposed to the client-side