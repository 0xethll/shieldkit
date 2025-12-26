# ShieldKit Playground

Interactive playground demonstrating different integration modes for the confidential widget.

## Overview

The ShieldKit Playground is a full-featured interactive demo that showcases how to integrate the `@shieldkit/react` confidential widget into your dApp. Unlike simple examples, this playground provides:

- **2 Integration Modes**: Dialog (popup) and Sidebar (embedded) patterns
- **Configurable Widget**: Customize features, tokens, and behavior in real-time
- **Live Code Preview**: See the exact code needed for your integration
- **Interactive Examples**: Experience different integration patterns in action

## Features

### Integration Modes

1. **Dialog Mode** - Widget as a popup/modal
   - Best for: Auxiliary features, occasional access
   - Pattern: Click button → Opens dialog → Perform operations
   - Example: Adding confidential widget to existing DeFi dashboard

2. **Sidebar Mode** - Widget as a persistent sidebar
   - Best for: Core features, frequent access
   - Pattern: Always visible, collapsible sidebar
   - Example: Privacy-first wallet applications

### Widget Customization

- Toggle features (Wrap/Transfer/Unwrap)
- Select supported tokens
- Configure default tab
- Preview code changes in real-time

### Interactive Layout

- **Left Panel**: Mode selection and widget configuration
- **Right Panel**: Live demo of selected integration mode
- **Bottom Panel**: Generated integration code

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

1. **Select Integration Mode**
   - Choose between Dialog Mode or Sidebar Mode
   - See how each pattern works in a real interface

2. **Configure the Widget**
   - Enable/disable features (Wrap/Transfer/Unwrap)
   - Select which tokens to support
   - Choose default starting tab

3. **Test the Integration**
   - Connect your wallet on Sepolia testnet
   - Interact with the widget in the selected mode
   - Try wrap, transfer, and unwrap operations

4. **Copy the Code**
   - Expand the code panel at the bottom
   - View mode-specific integration code
   - Copy and paste into your project

## Project Structure

```
src/
├── components/
│   ├── Playground/
│   │   ├── PlaygroundLayout.tsx       # Main layout with resizable panels
│   │   ├── ConfigurationPanel.tsx     # Left panel: mode & widget config
│   │   ├── PreviewArea.tsx            # Right panel: integration demo
│   │   └── CodeDisplay.tsx            # Bottom panel: code preview
│   ├── Widget/
│   │   ├── PrivacyWalletWidget.tsx    # Main confidential widget
│   │   ├── WrapPanel.tsx              # Wrap tokens UI
│   │   ├── TransferPanel.tsx          # Transfer UI
│   │   └── UnwrapPanel.tsx            # Unwrap UI with queue
│   ├── ScenarioApp/
│   │   ├── DialogModeMock.tsx         # Dialog integration demo
│   │   ├── SidebarModeMock.tsx        # Sidebar integration demo
│   │   └── ScenarioApp.tsx            # Mode router
│   └── ...
├── config/
│   ├── scenarios.ts                   # Integration mode configs
│   └── usePlaygroundConfig.ts         # Global config state
├── hooks/
│   └── useTokenBalances.ts            # Token balance management
└── App.tsx                            # Entry point with providers
```

## Key Concepts

### Integration Modes

Each mode demonstrates a different UI pattern:

**Dialog Mode:**
- Widget opens as a modal/popup when triggered
- Ideal for supplementary privacy features
- User clicks button → Dialog appears → Complete operations → Close

**Sidebar Mode:**
- Widget embedded as a collapsible sidebar
- Ideal when privacy is core to your app
- Always accessible, doesn't interrupt main workflow
- Can be collapsed to save screen space

```tsx
// From scenarios.ts
{
  dialog: {
    id: 'dialog',
    name: 'Dialog Mode',
    integrationMode: 'dialog',
    theme: {
      title: 'My DeFi Dashboard',
      description: 'Add confidential widget to your existing dApp',
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

### Integration Patterns

The playground demonstrates two integration approaches:

**Dialog Pattern:**
```tsx
import { useState } from 'react'
import { PrivacyWalletWidget } from '@shieldkit/react'

function MyApp() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <>
      <button onClick={() => setShowWidget(true)}>
        Open Confidential Widget
      </button>

      {showWidget && (
        <Dialog onClose={() => setShowWidget(false)}>
          <PrivacyWalletWidget />
        </Dialog>
      )}
    </>
  )
}
```

**Sidebar Pattern:**
```tsx
import { useState } from 'react'
import { PrivacyWalletWidget } from '@shieldkit/react'

function MyApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen">
      <main className={`flex-1 ${isSidebarOpen ? 'mr-96' : ''}`}>
        {/* Your app */}
      </main>

      <aside className={`fixed right-0 w-96 ${isSidebarOpen ? '' : 'hidden'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          Toggle
        </button>
        <PrivacyWalletWidget />
      </aside>
    </div>
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
