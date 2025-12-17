import { useState } from 'react'
import { useFactory, useWrappedTokenAddress } from '@z-payment/react'
import { CHAIN_IDS } from '@z-payment/contracts'
import type { Address } from 'viem'

export default function FactoryExample() {
  const [erc20Address, setErc20Address] = useState('')
  const [checkAddress, setCheckAddress] = useState('')

  // Create wrapper hook
  const { createWrapper, isLoading, isSuccess, error, txHash, reset } = useFactory({
    chainId: CHAIN_IDS.SEPOLIA,
    onSuccess: () => {
      console.log('Wrapper created!')
      setErc20Address('')
    },
  })

  // Check wrapper hook
  const { wrappedAddress, isLoading: isChecking } = useWrappedTokenAddress(
    checkAddress as Address | undefined,
    CHAIN_IDS.SEPOLIA
  )

  const handleCreate = async () => {
    if (!erc20Address || !erc20Address.startsWith('0x') || erc20Address.length !== 42) {
      alert('Please enter a valid ERC20 address')
      return
    }

    try {
      await createWrapper(erc20Address as Address)
    } catch (err) {
      console.error('Create wrapper error:', err)
    }
  }

  const handleCheck = () => {
    if (!checkAddress || !checkAddress.startsWith('0x') || checkAddress.length !== 42) {
      alert('Please enter a valid ERC20 address')
      return
    }
    // The hook will automatically query when checkAddress changes
  }

  return (
    <div className="example">
      <h2>Factory Operations</h2>
      <p className="description">
        Create new confidential token wrappers for any ERC20 token, or check if a
        wrapper already exists.
      </p>

      {/* Create Wrapper */}
      <div className="factory-section">
        <h3>Create New Wrapper</h3>
        <div className="form">
          <div className="form-group">
            <label htmlFor="create-erc20">ERC20 Token Address:</label>
            <input
              id="create-erc20"
              type="text"
              value={erc20Address}
              onChange={(e) => setErc20Address(e.target.value)}
              placeholder="0x..."
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={isLoading || !erc20Address}
            className="btn btn-primary"
          >
            {isLoading ? 'Creating Wrapper...' : 'Create Wrapper'}
          </button>

          {isSuccess && txHash && (
            <div className="result success">
              <p>✅ Wrapper created successfully!</p>
              <p className="tx-hash">
                Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              <button onClick={reset} className="btn btn-secondary btn-sm">
                Create Another
              </button>
            </div>
          )}

          {error && (
            <div className="result error">
              <p>❌ Error: {error}</p>
              <button onClick={reset} className="btn btn-secondary btn-sm">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Check Wrapper */}
      <div className="factory-section">
        <h3>Check Existing Wrapper</h3>
        <div className="form">
          <div className="form-group">
            <label htmlFor="check-erc20">ERC20 Token Address:</label>
            <input
              id="check-erc20"
              type="text"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="0x..."
              disabled={isChecking}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={isChecking || !checkAddress}
            className="btn btn-secondary"
          >
            {isChecking ? 'Checking...' : 'Check Wrapper'}
          </button>

          {checkAddress && !isChecking && (
            <div className="result info">
              {wrappedAddress ? (
                <>
                  <p>✅ Wrapper exists!</p>
                  <p className="address">
                    <strong>Wrapper Address:</strong>
                    <br />
                    {wrappedAddress}
                  </p>
                </>
              ) : (
                <p>❌ No wrapper found for this token.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="code-example">
        <h4>Code Example:</h4>
        <pre>{`import { useFactory, useWrappedTokenAddress } from '@z-payment/react'

// Create new wrapper
const { createWrapper, isLoading } = useFactory({
  chainId: 11155111, // Sepolia
  onSuccess: () => console.log('Created!')
})

await createWrapper('0xERC20Address...')

// Check if wrapper exists
const { wrappedAddress, isLoading } = useWrappedTokenAddress(
  '0xERC20Address...',
  11155111
)

if (wrappedAddress) {
  console.log('Wrapper exists at:', wrappedAddress)
}`}</pre>
      </div>

      <div className="info-box">
        <h4>🏭 Factory Contract</h4>
        <p>
          The ConfidentialTokenFactory contract allows you to create confidential
          token wrappers for any ERC20 token. Each ERC20 token can only have one wrapper.
        </p>
        <ul>
          <li>Creates ERC7984 confidential token wrappers</li>
          <li>One wrapper per ERC20 token</li>
          <li>Automatic wrapper discovery</li>
        </ul>
      </div>
    </div>
  )
}
