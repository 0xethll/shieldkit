/**
 * Utility to convert wagmi/viem client to ethers.js signer
 * Required for FHE operations that need ethers.js Signer
 */

import { Config, getConnectorClient } from '@wagmi/core'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import type { Account, Chain, Client, Transport } from 'viem'

/**
 * Convert a viem Client to an ethers.js Signer
 */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/**
 * Get an ethers.js Signer from wagmi config
 *
 * @param config - Wagmi config
 * @param options - Optional chain ID
 * @returns ethers.js JsonRpcSigner
 */
export async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId })
  return clientToSigner(client)
}
