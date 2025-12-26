import { useState, useEffect } from 'react'
import { Signer } from 'ethers'
import { getEthersSigner } from '@/lib/client-to-signer'
import { useConfig, useAccount } from 'wagmi'

export function useSigner() {
  const config = useConfig()
  const { address, isConnected } = useAccount()
  const [signer, setSigner] = useState<Signer | null>(null)

  useEffect(() => {
    const initSigner = async () => {
      if (!isConnected || !address) {
        setSigner(null)
        return
      }

      try {
        const s = await getEthersSigner(config)
        if (!s) {
          console.warn('Failed to initialize signer')
          setSigner(null)
          return
        }
        setSigner(s)
      } catch (error) {
        console.error('Error initializing signer:', error)
        setSigner(null)
      }
    }
    initSigner()
  }, [config, address, isConnected])

  return { signer }
}
