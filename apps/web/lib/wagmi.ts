import { http, createConfig, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
const infuraRpcURL = process.env.NEXT_PUBLIC_INFURA_RPC_URL || ''

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId,

    appName: 'Z-Payment',
    appDescription:
      'Private payments for any ERC20 token powered by Zama FHE',
    appUrl: 'https://z-payment.vercel.app/',
    appIcon: 'https://z-payment.vercel.app/favicon.ico',

    chains: [sepolia],
    transports: {
      [sepolia.id]: fallback([
        http(infuraRpcURL),
        http('https://ethereum-sepolia-rpc.publicnode.com'),
      ]),
    },
  }),
)
