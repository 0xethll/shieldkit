## Usage

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

npx hardhat keystore set SEPOLIA_RPC_URL
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ./ignition/modules/WrapperToken.ts --parameters ./ignition/parameters/WrapperToken.json
```

## Deployed Addresses

USDModule#USDERC20 - 0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a
cUSDX402Module#ConfidentialUSDX402 - 0xdCE9Fa07b2ad32D2E6C8051A895262C9914E9445
ConfidentialTokenFactoryModule#ConfidentialTokenFactory - 0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c