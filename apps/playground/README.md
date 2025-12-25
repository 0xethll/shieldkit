# ShieldKit Playground

Interactive playground demonstrating configurable confidential balance features across different DeFi scenarios.

## Overview

The ShieldKit Playground is a full-featured interactive demo that showcases how to integrate the `@shieldkit/react` confidential balance widget into different types of dApps. Unlike simple examples, this playground provides:

- **3 Real-world Scenarios**: Lending, Payment, and DeFi applications
- **Configurable Widget**: Customize features, tokens, and behavior in real-time
- **Live Code Preview**: See the exact code needed for your integration
- **Mock dApp Interfaces**: Experience the widget in context

## Features

### Scenario-Based Demos

1. **Confidential Lending** - Asset deposit with encrypted balances
   - Features: Wrap, Unwrap (no transfers)
   - Use case: Private collateral deposits

2. **Confidential Payment** - P2P transfers with hidden amounts
   - Features: Wrap, Transfer, Unwrap
   - Use case: Private salary payments, gifts

3. **Confidential DeFi** - Full-featured privacy protocol
   - Features: All operations enabled
   - Use case: Complete privacy layer integration

### Widget Customization

- Toggle features (Wrap/Transfer/Unwrap)
- Select supported tokens
- Configure default behavior
- Preview code changes in real-time

### Interactive Components

- **Left Panel**: Configuration controls
- **Right Panel**: Mock dApp with embedded widget
- **Bottom Panel**: Generated code display

## Quick Start

### Prerequisites

- Bun
- MetaMask or another Web3 wallet
- Sepolia testnet ETH ([get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# From the monorepo root
bun install
```

### Development

```bash
# From the monorepo root
bun run --filter='playground' dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
bun run build
```

## Usage

1. **Select a Scenario**
   - Choose from Lending, Payment, or DeFi scenarios
   - Each demonstrates different use cases

2. **Configure the Widget**
   - Enable/disable features using toggles
   - Select which tokens to support
   - Choose default starting tab

3. **Test the Integration**
   - Connect your wallet
   - Click "Open Confidential Balance Widget" in the mock dApp
   - Try wrap, transfer, and unwrap operations

4. **Copy the Code**
   - View generated code in the bottom panel
   - Copy integration code for your own project

## Project Structure

```
src/
├── components/
│   ├── Playground/
│   │   ├── PlaygroundLayout.tsx       # Main layout with resizable panels
│   │   ├── ConfigurationPanel.tsx     # Left panel: scenario & widget config
│   │   ├── PreviewArea.tsx            # Right panel: mock dApp display
│   │   └── CodeDisplay.tsx            # Bottom panel: code preview
│   ├── Widget/
│   │   ├── PrivacyWalletWidget.tsx    # Main confidential balance widget
│   │   ├── WrapPanel.tsx              # Wrap tokens UI
│   │   ├── TransferPanel.tsx          # Transfer UI
│   │   └── UnwrapPanel.tsx            # Unwrap UI with queue
│   ├── ScenarioApp/
│   │   ├── LendingAppMock.tsx         # Mock lending dApp
│   │   ├── PaymentAppMock.tsx         # Mock payment dApp
│   │   └── DeFiAppMock.tsx            # Mock DeFi dApp
│   └── ...
├── config/
│   ├── scenarios.ts                   # Scenario definitions & configs
│   └── usePlaygroundConfig.tsx        # Global config state
├── hooks/
│   └── useTokenBalances.ts            # Token balance management
└── App.tsx                            # Entry point with providers
```

## Key Concepts

### Scenario System

Each scenario defines:
- **Default Tab**: Which feature to show first (wrap/transfer/unwrap)
- **Enabled Features**: Which operations are available
- **Mock App**: Custom dApp interface demonstrating the use case

```tsx
// From scenarios.ts
{
  lending: {
    id: 'lending',
    name: 'Confidential Lending',
    defaultTab: 'wrap',
    features: {
      wrap: true,
      transfer: false,  // Disabled for this scenario
      unwrap: true,
    },
    mockApp: {
      title: 'Confidential Lending Platform',
      description: 'Deposit your assets confidentially and earn yields',
      type: 'lending',
    },
  }
}
```

### Widget Configuration

The widget adapts to configuration in real-time:

```tsx
import { usePlaygroundConfig } from '@/config/usePlaygroundConfig'

const { features, defaultTab, customTokens } = usePlaygroundConfig()

// Widget automatically shows/hides tabs based on features
// Supports only selected tokens
// Opens to the configured default tab
```

### Integration Pattern

The playground demonstrates the recommended integration pattern:

```tsx
// 1. Wrap your app with FHEProvider
<FHEProvider>
  <App />
</FHEProvider>

// 2. Use the widget anywhere in your dApp
import { PrivacyWalletWidget } from './components/Widget'

function YourDApp() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <>
      <button onClick={() => setShowWidget(true)}>
        Open Confidential Balance
      </button>

      {showWidget && (
        <Dialog>
          <PrivacyWalletWidget />
        </Dialog>
      )}
    </>
  )
}
```

## Testnet Information

**Network**: Sepolia Testnet
**Chain ID**: 11155111

**Contract Addresses**:
- Factory: `0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c`

**Supported Test Tokens**:
- USDC: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- USDT: `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`
- WETH: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- wBTC: `0xb060796D171EeEdA5Fb99df6B2847DA6D4613CAd`

Get testnet ETH from:
- [Sepolia Faucet](https://sepoliafaucet.com/)

## Learn More

- **@shieldkit/react API**: See `packages/react/README.md` for hook documentation
- **@shieldkit/core**: See `packages/core/README.md` for underlying SDK
- **Smart Contracts**: See `packages/contracts/README.md` for ERC7984 details

## Troubleshooting

### Widget Not Appearing

If the widget doesn't show when clicking the button:
1. Check browser console for errors
2. Ensure wallet is connected
3. Verify FHE initialization completed (check for "✅ FHE Ready" indicator)

### FHE Initialization Fails

If FHE fails to initialize:
1. Make sure you're on a supported browser (Chrome, Firefox, Edge)
2. Check that MetaMask is installed and unlocked
3. Try refreshing the page
4. Clear browser cache if issue persists

### Transactions Fail

Common reasons:
- Insufficient balance (need both tokens and ETH for gas)
- Wallet not on Sepolia testnet
- FHE not ready yet (wait for initialization)
- Token not approved (approve in Wrap panel first)

### Configuration Not Applying

If widget doesn't reflect configuration changes:
1. Configuration updates are immediate - no refresh needed
2. Some features require reconnecting the wallet
3. Check that the selected scenario supports the feature

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **ethers.js** - Required for FHE operations
- **@shieldkit/react** - Confidential token hooks
- **@tanstack/react-query** - Async state management
- **framer-motion** - Animations
- **react-resizable-panels** - Resizable layout
- **zustand** - Global state management

## License

MIT
