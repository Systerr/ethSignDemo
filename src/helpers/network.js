export const RPC_URL = "https://bsc-testnet.drpc.org/";
export const CHAIN_ID = 97;

/**
 * Make request ro EVM RPC
 * @param {String} method
 * @param {*} params
 * @returns {Promise<*>}
 */
export const makeRequest = async (method, params) => {
  const requestID = Date.now();

  const body = JSON.stringify({
    method,
    params,
    id: requestID,
    jsonrpc: "2.0",
  });

  const response = await fetch(RPC_URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });

  

  const content = await response.json();

  if (content.error) {
    console.error(content.error);
  }

  return content.result;
};
