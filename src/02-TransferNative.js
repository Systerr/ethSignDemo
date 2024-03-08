import * as RLP from "@ethereumjs/rlp";
import { bytesToHex } from "@noble/hashes/utils";
import { keccak_256 } from "@noble/hashes/sha3";
import { secp256k1 } from "@noble/curves/secp256k1";

import { privateKeyToAddress, add0x } from "./helpers/eth.js";
import { makeRequest, CHAIN_ID } from "./helpers/network.js";
import { waitForEnter } from "./helpers/terminal.js";
// @ts-ignore
process.loadEnvFile();

if (!process.env.PRIVATE_KEY) {
  console.error("Private key is not presented. Please generate it first");
  process.exit();
}

const address = privateKeyToAddress(process.env.PRIVATE_KEY);

console.log("Your ADDRESS is: ", address);

// https://ethereum.org/en/developers/docs/apis/json-rpc/
const nonce = await makeRequest("eth_getTransactionCount", [address, "latest"]);

console.log("Your NONCE is: ", nonce);

await waitForEnter();

const balance = await makeRequest("eth_getBalance", [address, "latest"]);

console.log("Your BALANCE is: ", balance);

const [maxPriorityFeePerGas, block] = await Promise.all([
  makeRequest("eth_maxPriorityFeePerGas"),
  makeRequest("eth_getBlockByNumber", ["latest", false]),
]);

console.log("Your MAX PRIORITY FEE PER GAS is: ", maxPriorityFeePerGas);
console.log("Your BLOCK is: ", block);

const oneETH = 10n ** 18n;

const maxPriorityFeePerGasReal = Number(maxPriorityFeePerGas)
  ? maxPriorityFeePerGas
  : add0x((1_000_000_000).toString(16));

// https://ethereum.github.io/yellowpaper/paper.pdf
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md#abstract
// 0x02 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, destination, amount, data, access_list, signature_y_parity, signature_r, signature_s]).
// all in hex. All Strast from '0x' empty ('0x0') perlaced with ''
let transaction = {
  // EIP-1559 transaction type
  // order is matter
  chainId: add0x(CHAIN_ID.toString(16)),
  nonce: Number(nonce) ? nonce : "",
  maxPriorityFeePerGas: maxPriorityFeePerGasReal, // tip is needed
  maxFeePerGas: add0x(
    (
      Number(block.baseFeePerGas) * 2 +
      Number(maxPriorityFeePerGasReal)
    ).toString(16)
  ),
  gasLimit: "0x5208", // this is a 21000 default value
  to: "0xaf6fB4C6E54631b9BD554Cd93E69244669b6e133",
  value: add0x((oneETH / 100n).toString(16)), // 0.01 eth in wei
  data: "", // to call and deploy smart contract.
  accessList: [],
};

console.log("Your TX is: ", transaction);
await waitForEnter();

// https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
let encodedTx = RLP.encode(Object.values(transaction));

// we should add tranaction type. in our case it '2' as we are doing EIP1559
encodedTx = new Uint8Array([2, ...Array.from(encodedTx)]);

const transactionToSign = bytesToHex(keccak_256(encodedTx));

const signature = await secp256k1.sign(
  transactionToSign,
  process.env.PRIVATE_KEY
);

console.log("Your TX encoded by RLP: ", bytesToHex(encodedTx));
console.log("Your TX keccak_256 hash to sign: ", transactionToSign);
console.log("Your TX signature: ", signature);

await waitForEnter();

transaction = {
  ...transaction,
  v: signature.recovery ? "0x1" : "",
  r: add0x(signature.r.toString(16)),
  s: add0x(signature.s.toString(16)),
};

console.log("Transaction with signature: ", transaction);

await waitForEnter();

encodedTx = RLP.encode(Object.values(transaction));
const encodedTxHex = add0x(bytesToHex(new Uint8Array([2, ...Array.from(encodedTx)])));

console.log("Your TX with signature encoded by RLP: ", encodedTxHex);

await waitForEnter();

const txHash = await makeRequest("eth_sendRawTransaction", [encodedTxHex]);

console.log("Your TX HASH: ", txHash);
console.log("Your TX URL: ", `https://testnet.bscscan.com/tx/${txHash}`);
