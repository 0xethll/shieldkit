import { useUnwrapQueue, useFinalizeUnwrap } from '@shieldkit/react'
import type { Address } from 'viem'

interface UnwrapQueueExampleProps {
  tokenAddress: Address
}

export default function UnwrapQueueExample({ tokenAddress }: UnwrapQueueExampleProps) {
  const { unwrapRequests, isLoading, error, refetch } = useUnwrapQueue({
    tokenAddress,
    enableAutoRefetch: true,
    refetchInterval: 15000, // Refresh every 15 seconds
  })

  const {
    finalizeUnwrap,
    isFinalizing,
    isSuccess,
    error: finalizeError,
    pendingTx,
    isFHEReady,
  } = useFinalizeUnwrap({
    tokenAddress,
    onSuccess: () => {
      console.log('Unwrap finalized!')
      refetch()
    },
  })

  const handleFinalize = async (burntAmount: string) => {
    if (!isFHEReady) {
      alert('FHE is not ready yet. Please wait.')
      return
    }

    try {
      await finalizeUnwrap(burntAmount as `0x${string}`)
    } catch (err) {
      console.error('Finalize error:', err)
    }
  }

  return (
    <div className="example">
      <h2>Unwrap Queue</h2>
      <p className="description">
        View and finalize your pending unwrap requests. Each unwrap request must be
        decrypted and finalized to receive your ERC20 tokens.
      </p>

      {!isFHEReady && (
        <p className="warning">⚠️ Waiting for FHE to initialize...</p>
      )}

      {isLoading && <p>Loading unwrap requests...</p>}

      {error && (
        <div className="result error">
          <p>❌ Error loading requests: {error}</p>
          <button onClick={refetch} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {unwrapRequests.length === 0 ? (
            <div className="empty-state">
              <p>No pending unwrap requests found.</p>
              <p className="note">
                Create an unwrap request in the "Unwrap" tab first.
              </p>
            </div>
          ) : (
            <div className="queue-list">
              <div className="queue-header">
                <button onClick={refetch} className="btn btn-secondary btn-sm">
                  Refresh
                </button>
                <p className="queue-count">
                  {unwrapRequests.length} pending request{unwrapRequests.length !== 1 ? 's' : ''}
                </p>
              </div>

              {unwrapRequests.map((request) => (
                <div key={request.id} className="queue-item">
                  <div className="queue-item-info">
                    <p>
                      <strong>Amount:</strong> {request.burntAmount.slice(0, 10)}...
                    </p>
                    <p>
                      <strong>Token:</strong> {request.tokenSymbol}
                    </p>
                    <p className="request-time">
                      Requested:{' '}
                      {new Date(parseInt(request.requestTimestamp) * 1000).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleFinalize(request.burntAmount)}
                    disabled={
                      isFinalizing ||
                      pendingTx === request.burntAmount ||
                      !isFHEReady
                    }
                    className="btn btn-primary btn-sm"
                  >
                    {pendingTx === request.burntAmount
                      ? 'Finalizing...'
                      : 'Finalize'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {isSuccess && (
            <div className="result success">
              <p>✅ Unwrap finalized successfully!</p>
            </div>
          )}

          {finalizeError && (
            <div className="result error">
              <p>❌ Finalization error: {finalizeError}</p>
            </div>
          )}
        </>
      )}

      <div className="code-example">
        <h4>Code Example:</h4>
        <pre>{`import { useUnwrapQueue, useFinalizeUnwrap } from '@shieldkit/react'

// Query pending unwrap requests
const { unwrapRequests, refetch } = useUnwrapQueue({
  tokenAddress: '0x...',
  enableAutoRefetch: true,
  refetchInterval: 15000
})

// Finalize unwrap requests
const { finalizeUnwrap, isFinalizing } = useFinalizeUnwrap({
  tokenAddress: '0x...',
  onSuccess: () => refetch()
})

// Finalize a specific request
await finalizeUnwrap(request.burntAmount)`}</pre>
      </div>

      <div className="info-box">
        <h4>📝 How It Works</h4>
        <ol>
          <li>Unwrap requests are queried from the indexer</li>
          <li>Click "Finalize" to decrypt the amount and complete unwrap</li>
          <li>Auto-refresh keeps the queue up-to-date</li>
          <li>After finalization, you'll receive your ERC20 tokens</li>
        </ol>
      </div>
    </div>
  )
}
