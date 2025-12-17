import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { FHEProvider, useFHEContext } from '@z-payment/react'
import { CONTRACT_ADDRESSES, CHAIN_IDS } from '@z-payment/contracts'
import WrapExample from './examples/WrapExample'
import UnwrapExample from './examples/UnwrapExample'
import TransferExample from './examples/TransferExample'
import UnwrapQueueExample from './examples/UnwrapQueueExample'
import FactoryExample from './examples/FactoryExample'
import './App.css'

function AppContent() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isFHEReady, fheError, retryFHE } = useFHEContext()

  const [activeTab, setActiveTab] = useState<'wrap' | 'unwrap' | 'transfer' | 'queue' | 'factory'>('wrap')

  // Use Sepolia testnet addresses
  const tokenAddress = CONTRACT_ADDRESSES[CHAIN_IDS.SEPOLIA].cUSD_ERC7984

  return (
    <div className="app">
      <header className="header">
        <h1>Z-Payment React Hooks Examples</h1>
        <p className="subtitle">Learn how to use @z-payment/react hooks</p>
      </header>

      {/* Wallet Connection */}
      <div className="connection-section">
        {!isConnected ? (
          <div className="connect-wallet">
            <h3>Connect Your Wallet</h3>
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className="btn btn-primary"
              >
                Connect with {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="wallet-info">
            <p>
              <strong>Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <button onClick={() => disconnect()} className="btn btn-secondary">
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* FHE Status */}
      {isConnected && (
        <div className="fhe-status">
          {fheError ? (
            <div className="status-error">
              <p>❌ FHE Initialization Error: {fheError}</p>
              <button onClick={retryFHE} className="btn btn-secondary">
                Retry
              </button>
            </div>
          ) : isFHEReady ? (
            <div className="status-success">
              <p>✅ FHE Ready</p>
            </div>
          ) : (
            <div className="status-loading">
              <p>⏳ Initializing FHE...</p>
            </div>
          )}
        </div>
      )}

      {/* Examples Tabs */}
      {isConnected && isFHEReady && (
        <div className="examples">
          <div className="tabs">
            <button
              className={activeTab === 'wrap' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('wrap')}
            >
              Wrap
            </button>
            <button
              className={activeTab === 'unwrap' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('unwrap')}
            >
              Unwrap
            </button>
            <button
              className={activeTab === 'transfer' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('transfer')}
            >
              Transfer
            </button>
            <button
              className={activeTab === 'queue' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('queue')}
            >
              Unwrap Queue
            </button>
            <button
              className={activeTab === 'factory' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('factory')}
            >
              Factory
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'wrap' && <WrapExample tokenAddress={tokenAddress} />}
            {activeTab === 'unwrap' && <UnwrapExample tokenAddress={tokenAddress} />}
            {activeTab === 'transfer' && <TransferExample tokenAddress={tokenAddress} />}
            {activeTab === 'queue' && <UnwrapQueueExample tokenAddress={tokenAddress} />}
            {activeTab === 'factory' && <FactoryExample />}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isConnected && (
        <div className="instructions">
          <h3>Getting Started</h3>
          <ol>
            <li>Connect your wallet (MetaMask recommended)</li>
            <li>Switch to Sepolia testnet</li>
            <li>Get testnet ETH from a faucet</li>
            <li>Try the examples above!</li>
          </ol>
          <p className="note">
            Note: This demo uses Sepolia testnet. Make sure you have testnet ETH.
          </p>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <FHEProvider>
      <AppContent />
    </FHEProvider>
  )
}

export default App
