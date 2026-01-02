"use client"

import { useAccount, useDisconnect, useChainId } from "wagmi"

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    disconnect,
  }
}
