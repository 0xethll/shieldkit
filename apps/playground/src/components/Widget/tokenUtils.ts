export const getTokenPrefix = (tokenType: 'erc20' | 'wrapped'): string => {
  return tokenType === 'wrapped' ? 'c' : ''
}
