import { http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

export const config = getDefaultConfig({
  appName: "GuardianVault",
  projectId: "YOUR_PROJECT_ID", // In a real app, this would be an env var
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
