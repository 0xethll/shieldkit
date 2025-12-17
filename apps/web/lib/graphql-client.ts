import { GraphQLClient } from 'graphql-request'

/**
 * Envio GraphQL endpoint URL
 * This should point to your deployed Envio indexer
 */
export const ENVIO_GRAPHQL_URL =
    process.env.NEXT_PUBLIC_ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'

/**
 * GraphQL client for querying Envio indexer
 * Using graphql-request instead of URQL to avoid APQ issues
 */
export const graphqlClient = new GraphQLClient(ENVIO_GRAPHQL_URL, {
    headers: {
        'content-type': 'application/json',
    },
})
