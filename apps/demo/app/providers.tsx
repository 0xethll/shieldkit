'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/wagmi'
import { FHEProvider } from '@/contexts/FHEContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { CustomTokensProvider } from '@/contexts/CustomTokensContext'
import { ConfidentialBalanceProvider } from '@/contexts/ConfidentialBalanceContext'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto">
          <CustomTokensProvider>
            <FHEProvider>
              <ConfidentialBalanceProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ConfidentialBalanceProvider>
            </FHEProvider>
          </CustomTokensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
