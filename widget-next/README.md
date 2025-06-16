# Bluvo Widget Next.js Example

This Next.js application demonstrates how to integrate the [@bluvo/widget-react](https://www.npmjs.com/package/@bluvo/widget-react) package into a Next.js project. It showcases both client-side widget implementation and server-side One-Time Token (OTT) generation for secure authentication.

## Features

- Client-side implementation of the Bluvo widget for cryptocurrency transactions
- Server-side implementation of the requestOTT action for secure authentication
- Support for wallet connections with multiple exchanges
- Complete configuration example for transaction mode

## Prerequisites

- Node.js 18.x or higher
- A Bluvo account with API credentials (organization ID, project ID, and API key)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/widget-next.git
   cd widget-next
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `src/sec.ts` file with your Bluvo API key:
   ```typescript
   export const MY_BLUVO_SECRET_KEY = "your-bluvo-api-key";
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:41545](http://localhost:41545) with your browser to see the result.

## Implementation Details

### Client-Side Widget

The Bluvo widget is implemented in `src/app/page.tsx` as a client component. The widget is configured with extensive options for both connection and transaction modes.

```tsx
import {BluvoWidget, BluvoWidgetProps} from "@bluvo/widget-react";
import {requestOTT} from "@/app/actions/server";

// Widget configuration
const settings: BluvoWidgetProps = {
  auth: {
    orgId: "your-org-id",
    projectId: "your-project-id",
    ottFn: requestOTT  // Server action for OTT generation
  },
  // Additional configuration...
}

// Widget implementation
<BluvoWidget {...settings} />
```

### Server-Side OTT Generation

The One-Time Token (OTT) is generated using a Next.js server action in `src/app/actions/server.ts`:

```typescript
"use server";

import {MY_BLUVO_SECRET_KEY} from "@/sec";

export const requestOTT = async () => {
  // Implementation of secure token generation
  // Makes API call to Bluvo's endpoint with authentication headers
}
```

## Key Features Demonstrated

1. **Authentication Flow**:
   - Secure server-side generation of one-time tokens
   - Client-side usage of tokens for widget authentication

2. **Widget Modes**:
   - Connection mode for linking exchange accounts
   - Transaction mode for initiating withdrawals

3. **Customization**:
   - Theme customization (dark mode, accent colors)
   - Exchange selection and filtering
   - Pre-filled transaction details

## Available Scripts

- `npm run dev`: Runs the development server on port 41545
- `npm run build`: Builds the application for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs the linter to check code quality

## Learn More

- [Bluvo Documentation](https://docs.bluvo.co)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)

## License

This example is licensed under the MIT License - see the LICENSE file for details.