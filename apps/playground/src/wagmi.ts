import { http, createConfig, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const infuraRpcURL = import.meta.env.VITE_INFURA_RPC_URL || ''

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',

    appName: 'ShieldKit Playground',
    appDescription: 'Interactive demo for @shieldkit/react confidential balance features',
    appUrl: 'https://shieldkit.vercel.app/',
    appIcon: 'https://shieldkit.vercel.app/favicon.ico',

    chains: [sepolia],
    transports: {
      [sepolia.id]: fallback([
        http(infuraRpcURL),
        http(),
        http('https://ethereum-sepolia-rpc.publicnode.com'),
      ]),
    },
  }),
)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
