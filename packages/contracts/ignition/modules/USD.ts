import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('USDModule', (m) => {
    const USD = m.contract('USDERC20', [
        'USD',
        'USD',
        6,
    ])

    return { USD }
})