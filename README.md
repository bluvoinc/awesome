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

| Name                | Description                                   | REST                                                    | SDK                                                          |
|---------------------|-----------------------------------------------|---------------------------------------------------------|--------------------------------------------------------------|
| `connect-wallet`    | Connect a crypto wallet                       | [post.ts](connect-wallet/rest/add-binance.ts)           | [add-binance.ts](connect-wallet/ts/add-binance.ts)           |
| `get-wallet`        | Get a crypto wallet                           | [fetch.ts](get-wallet/rest/get-wallet.ts)               | [get-wallet.ts](get-wallet/ts/get-wallet.ts)                 |
| `list-wallets`      | List all your customer's crypto wallets       | [fetch.ts](list-wallet/rest/list-wallets.ts)            | [list-wallets.ts](list-wallet/ts/list-wallets.ts)            | 
| `delete-wallet`     | Delete a crypto wallet                        | [fetch.ts](delete-wallet/rest/delete-wallet.ts)         | [delete-wallet.ts](delete-wallet/ts/delete-wallet.ts)        |
| `list-transactions` | List all transactions of a crypto wallet      | [fetch.ts](list-transactions/rest/list-transactions.ts) | [transactions.ts](list-transactions/ts/list-transactions.ts) |
| `withdraw`          | Withdraw assets CEX -> DEX                    | [fetch.ts](withdraw/rest/withdraw.ts)                   | [withdraw.ts](withdraw/ts/withdraw.ts)                       |
| `get-transaction`   | Get a specific transaction of a crypto wallet | coming soon                                             | coming soon                                                  |
| `list-orders`       | List all orders of a crypto wallet            | coming soon                                             | coming soon                                                  |
| `get-order`         | Get a specific order of a crypto wallet       | coming soon                                             | coming soon                                                  |
| `list-trades`       | List all trades of a crypto wallet            | coming soon                                             | coming soon                                                  |
| `get-trade`         | Get a specific trade of a crypto wallet       | coming soon                                             | coming soon                                                  |

## Projects

| Name      | Description                       | Link                        |
|-----------|-----------------------------------|-----------------------------|
| `dipsway` | Crypto trading platform           | [Link](https://dipsway.com) |

## UI Widget

| Name             | Description                       | Link                                |
|------------------|-----------------------------------|-------------------------------------|
| `@bluvo/nextjs`  | NextJS Embed UI widget component  | [Link](https://playground.bluvo.co) |
| `@bluvo/react`   | React Embed UI widget component   | coming soon                         |    
| `@bluvo/vue`     | Vue Embed UI widget component     | coming soon                         |
| `@bluvo/svelte`  | Svelte Embed UI widget component  | coming soon                         |
| `@bluvo/astro`   | Astro Embed UI widget component   | coming soon                         |
| `@bluvo/vanilla` | Vanilla Embed UI widget component | coming soon                         |
| `@bluvo/solid`   | Solid Embed UI widget component   | coming soon                         |

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