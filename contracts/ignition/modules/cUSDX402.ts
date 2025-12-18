import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('cUSDX402Module', (m) => {
    const underlyingTokenAddress = m.getParameter('underlyingTokenAddress')
    const facilitatorAddress = m.getParameter('facilitatorAddress')

    if (!underlyingTokenAddress || !facilitatorAddress) {
        throw new Error(
            'underlyingTokenAddress and facilitatorAddress must be provided and cannot be the zero address',
        )
    }

    const cUSDX402 = m.contract('ConfidentialUSDX402', [
        'Confidential USD',
        'cUSD',
        '',
        facilitatorAddress,
        underlyingTokenAddress
    ])

    return { cUSDX402 }
})