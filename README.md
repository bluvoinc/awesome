<p align="center">
  <br>
  <img width="400" src="./assets/awesome-bluvo-logo.svg" alt="logo of awesome-better-auth repository">
  <br>
  <br>
</p>

<h2 align='center'>awesome-bluvo</h2>

<p align='center'>
A curated list of awesome things related to <a href='https://bluvo.co/' target="_blank">Bluvo</a>
<br><br>

This repo contains projects intended to support [Bluvo] in various
ways:

- Code samples
- Crypto projects build on top of [Bluvo]
- Blogs, paper and articles

The following is provided without any promises or guarantees.

## Code Samples

### Core API Examples (Server-side with API Keys)

| Name                | Description                                   | REST                                                                                       | SDK                                                               |
|---------------------|-----------------------------------------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `connect-wallet`    | Connect CEX wallet with API credentials       | [add-binance.ts](https://docs.bluvo.co/api-reference/wallets/connect-wallet)               | [add-binance.ts](connect-wallet/ts/add-binance.ts)                |
| `withdraw`          | Withdraw assets from CEX to on-chain address  | [withdraw.ts](https://docs.bluvo.co/api-reference/transactions/withdraw-funds)             | [withdraw.ts](withdraw/ts/withdraw.ts)                            |
| `get-wallet`        | Get a crypto wallet                           | [get-wallet.ts](https://docs.bluvo.co/api-reference/wallets/get-wallet)                    | [get-wallet.ts](get-wallet/ts/get-wallet.ts)                      |
| `list-wallets`      | List all your customer's crypto wallets       | [list-wallets.ts](https://docs.bluvo.co/api-reference/wallets/list-wallets)                | [list-wallets.ts](list-wallet/ts/list-wallets.ts)                 | 
| `delete-wallet`     | Delete a crypto wallet                        | [delete-wallet.ts](https://docs.bluvo.co/api-reference/wallets/delete-wallet)              | [delete-wallet.ts](delete-wallet/ts/delete-wallet.ts)             |
| `list-transactions` | List all transactions of a crypto wallet      | [list-transactions.ts](https://docs.bluvo.co/api-reference/transactions/list-transactions) | [list-transactions.ts](list-transactions/ts/list-transactions.ts) |
| `get-transaction`   | Get a specific transaction of a crypto wallet | coming soon                                                                                | coming soon                                                       |
| `list-orders`       | List all orders of a crypto wallet            | coming soon                                                                                | coming soon                                                       |
| `get-order`         | Get a specific order of a crypto wallet       | coming soon                                                                                | coming soon                                                       |
| `list-trades`       | List all trades of a crypto wallet            | coming soon                                                                                | coming soon                                                       |
| `get-trade`         | Get a specific trade of a crypto wallet       | coming soon                                                                                | coming soon                                                       |

### Widget Examples (Client-side with OAuth2)

| Framework | Description                            | Link                            |
|-----------|----------------------------------------|---------------------------------|
| Next.js   | Complete OAuth2 wallet connection flow | [widget-next](widget-next/)     |
| Svelte    | Complete OAuth2 wallet connection flow | [widget-svelte](widget-svelte/) |

## Recent Updates

- ✅ **Code Refactoring**: Eliminated duplication in polling logic with shared `pollWorkflowStatus` utility
- ✅ **Bug Fixes**: Fixed critical error handling in wallet connection workflow
- ✅ **New Examples**: Added Next.js and Svelte widget integration examples
- ✅ **Improved Documentation**: Enhanced README with authentication method clarifications

## Authentication Methods

### API Key Authentication (Server-side)
Perfect for backend applications and server-to-server communication:
- **Examples**: `connect-wallet/ts/`, `withdraw/ts/` 
- **Use cases**: Automated trading bots, portfolio management systems, server applications
- **Security**: API keys with restricted permissions and IP whitelisting

### OAuth2 Authentication (Client-side)
Ideal for frontend applications with user interaction:
- **Examples**: `widget-next`, `widget-svelte`
- **Use cases**: Web applications, mobile apps, user-facing dashboards
- **Security**: OAuth2 flow with user consent and secure token handling

## Projects

| Name      | Description                       | Link                        |
|-----------|-----------------------------------|-----------------------------|
| `dipsway` | Crypto trading platform           | [Link](https://dipsway.com) |

## UI Widget Components

| Name             | Description                       | Link                                                      |
|------------------|-----------------------------------|-----------------------------------------------------------|
| `@bluvo/nextjs`  | NextJS Embed UI widget component  | [NPM](https://www.npmjs.com/package/@bluvo/widget-react)  |
| `@bluvo/react`   | React Embed UI widget component   | [NPM](https://www.npmjs.com/package/@bluvo/widget-react)  |    
| `@bluvo/vue`     | Vue Embed UI widget component     | coming soon                                               |
| `@bluvo/svelte`  | Svelte Embed UI widget component  | [NPM](https://www.npmjs.com/package/@bluvo/widget-svelte) |
| `@bluvo/astro`   | Astro Embed UI widget component   | coming soon                                               |
| `@bluvo/vanilla` | Vanilla Embed UI widget component | [NPM](https://www.npmjs.com/package/@bluvo/widget-vanjs)  |
| `@bluvo/solid`   | Solid Embed UI widget component   | coming soon                                               |

## Papers, Blogs and Articles

- [Multi Tenants DBs]: Bluvo uses multi-tenant databases to ensure atomicity and isolation of data.
- [API Key Generation]: How Bluvo uses [better-auth] to generate API keys for its customers.
- [Webhook]: How Bluvo uses webhooks to notify of events in connected cryptocurrency wallets.
- [Encryption]: How Bluvo encryption works.

## Contributing

Open a PR to add to the list.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


<!-- ## Docs -->
[Turso]: https://turso.tech
[Bluvo]: https://bluvo.co
[Multi Tenants DBs]: https://bluvo.co/docs/multi-tenants-dbs
[Encryption]: https://docs.bluvo.co/guide
[API Key Generation]: https://docs.bluvo.co/guide
[better-auth]: https://better-auth.vercel.app/
[Webhook]: https://docs.bluvo.co/guide