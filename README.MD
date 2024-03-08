# About

This is a tutorial of how to make a ETH transaction by using only low level cryptograhpy libraries.

# Setup

This demo required node.js >=21.7.0

Please install it first

[text](https://nodejs.org/en)

# Run

First install dependency

```bash
npm i
```

This demo suppose to work with a nbn testnet mostly bacausse this testnet have a good faucet (no discord, twitter posting subscription, etc). But it easy to use other chains too
[text](https://www.bnbchain.org/en/testnet-faucet)

## Key generation

Given command will generate priate key for you and save it to .env file

```bash
node src/01-GenerateKey.js
```

## Signin and sendig transaction

This is step by step guide to sign a transaction and broadcast it. Please take a look at codebase to understand it

```bash
node node src/02-TransferNative.js
```
