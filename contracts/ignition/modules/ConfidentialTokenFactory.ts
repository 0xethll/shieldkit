import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('ConfidentialTokenFactoryModule', (m) => {
    const factory = m.contract('ConfidentialTokenFactory', [])

    return { factory }
})
