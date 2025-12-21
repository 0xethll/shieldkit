import { useState } from 'react'
import { useWrap } from '@shieldkit/react'
import type { Address } from 'viem'

interface WrapExampleProps {
  tokenAddress: Address
}

export default function WrapExample({ tokenAddress }: WrapExampleProps) {
  const [amount, setAmount] = useState('')

  const { wrap, isLoading, isSuccess, error, txHash, reset } = useWrap({
    tokenAddress,
    decimals: 6,
    onSuccess: () => {
      console.log('Wrap successful!')
      setAmount('')
    },
  })

  const handleWrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      await wrap(amount)
    } catch (err) {
      console.error('Wrap error:', err)
    }
  }

  return (
    <div className="example">
      <h2>Wrap ERC20 to Confidential Token</h2>
      <p className="description">
        Convert your ERC20 tokens into confidential tokens. This wraps your tokens
        into an encrypted format for private transactions.
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="wrap-amount">Amount to Wrap:</label>
          <input
            id="wrap-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            disabled={isLoading}
            step="0.000001"
            min="0"
          />
        </div>

        <button
          onClick={handleWrap}
          disabled={isLoading || !amount}
          className="btn btn-primary"
        >
          {isLoading ? 'Wrapping...' : 'Wrap Tokens'}
        </button>

        {isSuccess && txHash && (
          <div className="result success">
            <p>✅ Wrap successful!</p>
            <p className="tx-hash">
              Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
            <button onClick={reset} className="btn btn-secondary btn-sm">
              Wrap More
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
        <pre>{`import { useWrap } from '@shieldkit/react'

const { wrap, isLoading, isSuccess } = useWrap({
  tokenAddress: '0x...',
  decimals: 6,
  onSuccess: () => console.log('Wrapped!')
})

// Wrap 100 tokens
await wrap('100')`}</pre>
      </div>
    </div>
  )
}
