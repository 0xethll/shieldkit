import { useState } from 'react'
import { useTransfer } from '@shieldkit/react'
import type { Address } from 'viem'

interface TransferExampleProps {
  tokenAddress: Address
}

export default function TransferExample({ tokenAddress }: TransferExampleProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const { transfer, isLoading, isSuccess, error, txHash, canTransfer, reset } = useTransfer({
    tokenAddress,
    decimals: 6,
    onSuccess: () => {
      console.log('Transfer successful!')
      setRecipient('')
      setAmount('')
    },
  })

  const handleTransfer = async () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      alert('Please enter valid recipient address and amount')
      return
    }

    // Basic address validation
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      alert('Invalid Ethereum address')
      return
    }

    try {
      await transfer(recipient as Address, amount)
    } catch (err) {
      console.error('Transfer error:', err)
    }
  }

  return (
    <div className="example">
      <h2>Transfer Confidential Tokens</h2>
      <p className="description">
        Send confidential tokens to another address. The transfer amount is encrypted
        on-chain, providing privacy for your transactions.
      </p>

      <div className="form">
        <div className="form-group">
          <label htmlFor="transfer-recipient">Recipient Address:</label>
          <input
            id="transfer-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="transfer-amount">Amount to Transfer:</label>
          <input
            id="transfer-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25"
            disabled={isLoading}
            step="0.000001"
            min="0"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={isLoading || !canTransfer || !recipient || !amount}
          className="btn btn-primary"
        >
          {isLoading ? 'Transferring...' : 'Transfer Tokens'}
        </button>

        {!canTransfer && (
          <p className="warning">⚠️ Waiting for wallet and FHE to be ready...</p>
        )}

        {isSuccess && txHash && (
          <div className="result success">
            <p>✅ Transfer successful!</p>
            <p className="tx-hash">
              Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
            <button onClick={reset} className="btn btn-secondary btn-sm">
              Transfer More
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
        <pre>{`import { useTransfer } from '@shieldkit/react'

const { transfer, isLoading, canTransfer } = useTransfer({
  tokenAddress: '0x...',
  decimals: 6,
  onSuccess: () => console.log('Transferred!')
})

// Transfer 25 tokens (amount is encrypted automatically)
if (canTransfer) {
  await transfer('0xRecipient...', '25')
}`}</pre>
      </div>

      <div className="info-box">
        <h4>🔐 Privacy Features</h4>
        <ul>
          <li>Transfer amounts are encrypted on-chain</li>
          <li>Only sender and recipient can decrypt their balances</li>
          <li>Third parties cannot see transaction amounts</li>
        </ul>
      </div>
    </div>
  )
}
