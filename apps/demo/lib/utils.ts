import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats verbose blockchain error messages into user-friendly text
 * @param error - Raw error message from wagmi/viem
 * @returns Shortened, user-friendly error message
 */
export function formatErrorMessage(error: string | null | undefined): string | null {
  if (!error) return null

  // Extract the main error message before technical details
  const lines = error.split('\n')
  const mainMessage = lines[0].trim()

  // Common error patterns to simplify
  if (mainMessage.includes('User rejected')) {
    return 'User rejected the request'
  }
  if (mainMessage.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  if (mainMessage.includes('gas required exceeds')) {
    return 'Gas estimation failed - insufficient balance or invalid transaction'
  }
  if (mainMessage.includes('execution reverted')) {
    return 'Transaction failed - please check token balance and try again'
  }

  // For other errors, return just the first sentence or line
  const firstSentence = mainMessage.split('.')[0] + '.'
  return firstSentence.length < mainMessage.length
    ? firstSentence
    : mainMessage
}