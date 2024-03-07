import fs from "node:fs/promises";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/hashes/utils";
import { fullPublicKeyToAddress } from "./helpers/eth.js";

try {
  // @ts-ignore
  process.loadEnvFile();
  console.error("Env file is presented. Please remove it first");
  process.exit();
} catch {
  console.log("No .env file found. We can process to generation");
}

// https://github.com/paulmillr/noble-curves
const privKey = secp256k1.utils.randomPrivateKey();

const hex = bytesToHex(privKey);

console.log("Your PRIVATE key is: ", hex);

// two type - compressed (0x2xxxx)  and full (0x4xxxx). Possible to restore compressed key
const publicKey = secp256k1.getPublicKey(privKey, false);

console.log("Your PUBLIC  key is: ", bytesToHex(publicKey));

console.log("Your ADDRESS is: ", fullPublicKeyToAddress(bytesToHex(publicKey)));

await fs.writeFile(".env", `PRIVATE_KEY=${hex}`);

console.log("Your.env file is ready. You can use another scripts now");

// https://www.bnbchain.org/en/testnet-faucet
