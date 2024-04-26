# ZuAuth Simple Server

A minimal web server with a single endpoint that verifies an ETHBerlin ZK ticket PCD using ZuAuth.

## Setup

To run in local development or in a hosted environment, you'll first need to make sure you have [Node.js](https://nodejs.org/en/download/current).

Then, you'll need to install dependencies and start the server.

```bash
npm install # install deps
npm start
```

You can also use Yarn instead of NPM.

```bash
yarn # install deps
yarn start
```

## Usage

Once the server is running, you can verify a proof by querying this endpoint.

```
GET /verify?proof=<proof>
```

Where `<proof>` is a serialized ZKEdDSAEventTicketPCD sent by the client.

Here's what the endpoint responds with when `<proof>` is a valid, serialized ZK proof of an ETHBerlin ticket.

```json
{
  "success": true
}
```

Here's what the endpoint responds with otherwise - e.g., if an error occurs or the proof is not a valid ZK proof of an ETHBerlin tiket.

```json
{
  "success": false,
  "error": "<error message here>"
}
```
