import { useState } from 'react'
import { useUnwrap } from '@shieldkit/react'
import type { Address } from 'viem'

interface UnwrapExampleProps {
  tokenAddress: Address
}

export default function UnwrapExample({ tokenAddress }: UnwrapExampleProps) {
  const [amount, setAmount] = useState('')

  const { unwrap, isLoading, isSuccess, error, txHash, reset, isFHEReady } = useUnwrap({
    tokenAddress,
    onSuccess: () => {
      console.log('Unwrap request created!')
      setAmount('')
    },
  })

  const handleUnwrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!isFHEReady) {
      alert('FHE is not ready yet. Please wait.')
      return
    }

    try {
      await unwrap(amount)
    } catch (err) {
      console.error('Unwrap error:', err)
    }
  }

  return (
    <div className="example">
      <h2>Unwrap Confidential Token to ERC20</h2>
      <p className="description">
        Request to unwrap your confidential tokens back to ERC20 tokens. This creates
        an unwrap request that must be finalized later (see Unwrap Queue tab).
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="unwrap-amount">Amount to Unwrap:</label>
          <input
            id="unwrap-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50"
            disabled={isLoading}
            step="0.000001"
            min="0"
          />
        </div>

        <button
          onClick={handleUnwrap}
          disabled={isLoading || !amount || !isFHEReady}
          className="btn btn-primary"
        >
          {isLoading ? 'Creating Unwrap Request...' : 'Request Unwrap'}
        </button>

        {!isFHEReady && (
          <p className="warning">⚠️ Waiting for FHE to initialize...</p>
        )}

        {isSuccess && txHash && (
          <div className="result success">
            <p>✅ Unwrap request created!</p>
            <p className="tx-hash">
              Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
            <p className="note">
              Go to the "Unwrap Queue" tab to finalize your request.
            </p>
            <button onClick={reset} className="btn btn-secondary btn-sm">
              Request More
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

      <div className="code-example">
        <h4>Code Example:</h4>
        <pre>{`import { useUnwrap } from '@shieldkit/react'

const { unwrap, isLoading, isFHEReady } = useUnwrap({
  tokenAddress: '0x...',
  onSuccess: () => console.log('Unwrap requested!')
})

// Request to unwrap 50 tokens (FHE encrypts amount internally)
if (isFHEReady) {
  await unwrap('50')
}`}</pre>
      </div>

      <div className="info-box">
        <h4>ℹ️ Two-Step Unwrap Process</h4>
        <ol>
          <li><strong>Request Unwrap:</strong> Create an encrypted unwrap request (this step)</li>
          <li><strong>Finalize Unwrap:</strong> Decrypt and complete the unwrap (see Unwrap Queue tab)</li>
        </ol>
      </div>
    </div>
  )
}
