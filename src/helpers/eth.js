import { keccak_256 } from "@noble/hashes/sha3";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

/**
 * We only expect full key there, not a compact one.
 * @param {String|Uint8Array} publicKey
 * @returns
 */
export const fullPublicKeyToAddress = (publicKey) => {
  if (!(publicKey instanceof Uint8Array)) {
    publicKey = hexToBytes(publicKey);
  }

  // 0x2 -> compressed
  // 0x4 -> full public key
  const keyBody = publicKey.slice(1, publicKey.length);

  const keccakHashUint = keccak_256(keyBody);

  const keccakHassHex = bytesToHex(keccakHashUint);

  return `0x${keccakHassHex.slice(-40).toString()}`; // take last 20 bytes as ethereum adress
};

/**
 * convert private key to ETH address
 * @param {string|Uint8Array} privateKey
 * @returns
 */
export const privateKeyToAddress = (privateKey) => {
  const publicKey = secp256k1.getPublicKey(privateKey, false);
  return fullPublicKeyToAddress(publicKey);
};

/**
 * Simple helper to add 0x to the hex strings
 * @param {string} hex
 * @returns
 */
export function add0x(hex) {
  return /^0x/i.test(hex) ? hex : `0x${hex}`;
}
