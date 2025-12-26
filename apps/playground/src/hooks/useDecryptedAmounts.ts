import { useState, useEffect, useRef } from 'react'
import type { UnwrapRequest, FhevmInstance, DecryptionResult } from '@shieldkit/react'
import { decryptPublicly } from '@shieldkit/core'

/**
 * Hook to asynchronously decrypt amounts for unwrap requests
 * @param requests - Array of unwrap requests to decrypt
 * @param fheInstance - FHE instance for decryption (optional, will wait if not ready)
 * @returns Map of burntAmount -> decryption result
 */
export function useDecryptedAmounts(
  requests: UnwrapRequest[],
  fheInstance: FhevmInstance | null
) {
  const [decryptedCache, setDecryptedCache] = useState<Map<string, DecryptionResult>>(
    new Map()
  )

  // Track which amounts are currently being decrypted
  const decryptingRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!fheInstance || requests.length === 0) return

    // Decrypt each request asynchronously
    requests.forEach(async (request) => {
      const burntAmount = request.burntAmount

      // Skip if already finalized (has cleartext from indexer)
      if (request.isFinalized && request.cleartextAmount) {
        return
      }

      // Skip if already decrypted or currently decrypting
      if (decryptedCache.has(burntAmount) || decryptingRef.current.has(burntAmount)) {
        return
      }

      // Mark as decrypting
      decryptingRef.current.add(burntAmount)
      setDecryptedCache((prev) => new Map(prev).set(burntAmount, { status: 'loading' }))

      try {
        const [cleartextAmount, proof] = await decryptPublicly(
          fheInstance,
          burntAmount as `0x${string}`
        )

        setDecryptedCache((prev) =>
          new Map(prev).set(burntAmount, {
            cleartextAmount,
            proof,
            status: 'success',
          })
        )
      } catch (error) {
        console.error(`Failed to decrypt amount ${burntAmount}:`, error)
        setDecryptedCache((prev) =>
          new Map(prev).set(burntAmount, {
            status: 'error',
            error: error instanceof Error ? error.message : 'Decryption failed',
          })
        )
      } finally {
        decryptingRef.current.delete(burntAmount)
      }
    })
  }, [requests, fheInstance, decryptedCache])

  return decryptedCache
}
