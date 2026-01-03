import { http, createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

// Get RPC URL from environment variables
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/1e3ffd62bdaa426e98445e6c07ab480c'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'GuardianVault Family Wallet',
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
    [mainnet.id]: http(),
  },
})
