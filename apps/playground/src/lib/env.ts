/**
 * Environment Configuration
 *
 * Centralized management of all environment variables.
 * Vite exposes environment variables via import.meta.env with VITE_ prefix.
 *
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

/**
 * Application environment variables
 * All variables are validated and typed for safety
 */
export const env = {
  /**
   * Alchemy API Key for blockchain data queries
   * @see https://www.alchemy.com/
   */
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,

  /**
   * Envio GraphQL endpoint for indexer queries
   * Used by useUnwrapQueue and other data fetching hooks
   */
  graphqlUrl: (import.meta.env.VITE_ENVIO_GRAPHQL_URL as string) || '',
} as const

/**
 * Validate required environment variables
 * Throws error if critical variables are missing
 */
export function validateEnv(): void {
  const errors: string[] = []

  if (!env.alchemyApiKey) {
    errors.push('VITE_ALCHEMY_API_KEY is required')
  }

  if (!env.graphqlUrl) {
    console.warn('VITE_ENVIO_GRAPHQL_URL is not set. Queue features may not work properly.')
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }
}

/**
 * Check if all optional services are configured
 */
export const isGraphqlConfigured = (): boolean => {
  return !!env.graphqlUrl && env.graphqlUrl.length > 0
}
